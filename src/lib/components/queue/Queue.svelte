<script lang="ts">
  import type { Queue } from '$lib/server/queue';
  import { createQuery } from '@tanstack/svelte-query';
  import { cancelJob, getQueue } from '$lib/requests';
  import type { JobProgress } from '$lib/server/queue/types';
  import { formatEta } from '$lib';

  const refetchInterval = 1000;

  const queue = createQuery<Queue>(() => ({
    queryKey: ['queue'],
    queryFn: () => getQueue(),
    refetchInterval,
  }));

  async function cancelJobButton(jobId: number) {
    await cancelJob(jobId);
    await queue.refetch();
  }

  function formatProgress(progress: JobProgress) {
    let output = `${progress.percent}%`;
    if (progress.fps) {
      output += ` ${progress.fps.current} FPS (${progress.fps.average} avg)`;
    }
    if (progress.eta) {
      output += ` ETA ${formatEta(progress.eta)}`;
    }
    return output;
  }
</script>

{#if queue.isLoading}
  <h2>Loading queue...</h2>
{:else if queue.error}
  <h2>Error!</h2>
  <p>{queue.error.message}</p>
{:else if queue.isSuccess}
  <h2>Queue</h2>
  <table>
    <thead>
      <tr>
        <th>Status</th>
        <th>Job</th>
        <th>Progress</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#if queue.data.length}
        {#each queue.data as job (job.id)}
          <tr>
            <td>{job.status}</td>
            <td>{job.title}</td>
            <td>{formatProgress(job.progress)}</td>
            <td><button onclick={() => void cancelJobButton(job.id)}>Cancel</button></td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td colspan={3}>No jobs have been created</td>
        </tr>
      {/if}
    </tbody>
  </table>
{/if}
