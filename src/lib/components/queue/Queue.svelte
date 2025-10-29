<script lang="ts">
  import type { Queue } from '$lib/server/queue';
  import { createQuery } from '@tanstack/svelte-query';
  import { getQueue } from '$lib/requests';

  const refetchInterval = undefined; // 100_000;

  const queue = createQuery<Queue>(() => ({
    queryKey: ['queue'],
    queryFn: () => getQueue(),
    refetchInterval,
  }));
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
        <th>Job</th>
        <th>Status</th>
        <th>Progress</th>
      </tr>
    </thead>
    <tbody>
      {#if queue.data.length}
        {#each queue.data as job (job.id)}
          <tr>
            <td>{job.input} => {job.output}</td>
            <td>{job.status}</td>
            <td>{job.progress}</td>
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
