import { maybeFetchContributors } from '../tools/contributors';
import { populateReleases } from '../tools/fetch-releases';

export default async function setup() {
  await Promise.all([maybeFetchContributors(true), populateReleases()]);
}
