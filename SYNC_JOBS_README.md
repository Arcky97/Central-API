# YouTube Sync Job System

A durable, job-based system for managing YouTube sync and backfill operations in the Central API.

## Overview

This system decouples sync operations from HTTP requests, allowing the frontend to:
- Start a sync/backfill without blocking
- Poll job status to display progress
- Handle long-running operations gracefully
- Receive real-time updates via polling

## Architecture

### Components

1. **SyncJobsService** - Core job management logic
   - Create jobs
   - Update job status and progress
   - Retrieve job state
   - Handle transitions (queued → running → completed/failed)

2. **SyncJobRepository** - Database persistence
   - CRUD operations on `syncJobs` table
   - Query jobs by status, ID, etc.

3. **YoutubeSyncQueue** - BullMQ job queue
   - Stores pending sync/backfill tasks
   - Ensures job persistence across restarts
   - Redis-backed for durability

4. **YoutubeSyncWorker** - Async job processor
   - Processes queued jobs one at a time
   - Updates job status in real-time
   - Handles errors and failures gracefully

5. **YoutubeSyncController** - HTTP endpoints
   - `POST /v1/youtube/sync` - Start full sync
   - `POST /v1/youtube/sync/fill/:date` - Start backfill from date
   - `GET /v1/youtube/sync/jobs/:jobId` - Check job status

## Database Schema

```sql
CREATE TABLE syncJobs (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  progress INT,
  currentItem VARCHAR(255),
  message VARCHAR(500),
  errorMessage TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  startedAt TIMESTAMP,
  finishedAt TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_created_at (createdAt)
);
```

## API Usage

### Start a Sync Job

**Request:**
```bash
POST /v1/youtube/sync
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "message": "Sync job queued"
}
```

### Start a Backfill Job

**Request:**
```bash
POST /v1/youtube/sync/fill/2026-08-01
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "message": "Backfill job from 2026-08-01 queued"
}
```

### Poll Job Status

**Request:**
```bash
GET /v1/youtube/sync/jobs/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "type": "youtube_backfill",
  "status": "running",
  "progress": 45,
  "currentItem": "2026-08-15",
  "message": "Processing backfill",
  "errorMessage": null,
  "createdAt": "2026-08-16T10:00:00.000Z",
  "startedAt": "2026-08-16T10:00:15.000Z",
  "finishedAt": null,
  "updatedAt": "2026-08-16T10:05:30.000Z"
}
```

## Job Lifecycle

```
queued → running → completed
              ↘ failed
```

### Queued
- Job created and enqueued
- Waiting for worker to pick it up
- No startedAt time yet

### Running
- Worker has claimed the job
- startedAt is set
- Progress can be 0-100
- currentItem tracks what's being processed

### Completed
- Sync/backfill finished successfully
- progress = 100
- finishedAt is set
- No errorMessage

### Failed
- An error occurred during processing
- errorMessage contains failure details
- finishedAt is set
- Progress may be partial

## Job Types

### youtube_sync
Full synchronization of YouTube channel data:
- Fetches latest channel info
- Syncs all videos
- Updates analytics
- Creates snapshots

### youtube_backfill
Historical backfill from a specific date:
- Processes date range (startDate → today)
- Creates snapshots for each day
- Shows progress by date

## Progress Semantics

For backfill operations, progress is estimated based on:
- Days elapsed / Total days to process
- Updates as each date completes

For full sync, progress increments as phases complete:
- 0% - Job started
- 25% - Channel synced
- 50% - Videos fetched
- 75% - Analytics synced
- 100% - Snapshots created

## Frontend Integration

### Typical Flow

```typescript
// 1. Start a sync job
const startResponse = await fetch('/v1/youtube/sync', { method: 'POST' });
const { jobId } = await startResponse.json();

// 2. Poll for status
const pollStatus = async () => {
  const response = await fetch(`/v1/youtube/sync/jobs/${jobId}`);
  const job = await response.json();
  
  if (job.status === 'completed') {
    console.log('Sync finished!');
    return;
  }
  
  if (job.status === 'failed') {
    console.error('Sync failed:', job.errorMessage);
    return;
  }
  
  // Show progress
  console.log(`Progress: ${job.progress}%`);
  console.log(`Currently: ${job.currentItem}`);
  
  // Poll again in 2 seconds
  setTimeout(pollStatus, 2000);
};

pollStatus();
```

### Progress Bar Example

```tsx
function SyncProgressBar({ jobId }) {
  const [job, setJob] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(`/v1/youtube/sync/jobs/${jobId}`);
      const data = await response.json();
      setJob(data);

      if (data.status === 'completed' || data.status === 'failed') {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  if (!job) return <div>Loading...</div>;

  return (
    <div>
      <div className="progress-bar">
        <div style={{ width: `${job.progress}%` }}>
          {job.progress}%
        </div>
      </div>
      <p>{job.message}</p>
      {job.currentItem && <p>Processing: {job.currentItem}</p>}
      {job.status === 'failed' && (
        <p className="error">{job.errorMessage}</p>
      )}
    </div>
  );
}
```

## Environment Setup

1. **Database** - syncJobs table is auto-created via schema syncer
2. **Redis** - BullMQ uses existing Redis connection
3. **Workers** - Auto-started in `/src/workers/index.ts`

## Testing

Run the test suite:

```bash
npm test -- sync-jobs.service.test.ts
```

Tests cover:
- Job creation
- Status transitions
- Progress tracking
- Error handling
- Backfill workflows
- Timestamp management

## Error Handling

If a sync job fails:

1. **Worker catches error** and logs it
2. **Job marked as failed** in database
3. **errorMessage populated** with error details
4. **finishedAt timestamp** set
5. **Frontend can retry** by starting a new job

Example failure response:
```json
{
  "status": "failed",
  "errorMessage": "YouTube API returned 403: Quota exceeded",
  "message": "Sync failed",
  "finishedAt": "2026-08-16T10:15:45.000Z"
}
```

## Performance Considerations

- **Concurrency: 1** - Only one sync/backfill at a time (prevents rate limiting)
- **Queue persistence** - Jobs survive server restarts via Redis
- **Lightweight polling** - Status endpoint is fast database query
- **No blocking requests** - All sync work happens in background

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Pause/resume functionality
- [ ] Job history and analytics
- [ ] Configurable retry logic
- [ ] Partial progress for sync phases
- [ ] Concurrent backfill batches (with rate limiting)
