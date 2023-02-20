const axios = require('axios');
const fs = require('fs');
const REPOS = [
  {
    "Organisation": "coreos",
    "Repository": "hyperkube",
    "Tag": "v1.10.4_coreos.0"
  }
]

async function getVulnerabilities(repos) {
  let response = [];
  if (!repos || repos.length == 0) {
    return [];
  }

  for (let repo of repos) {
    const tag = await axios.get(`https://quay.io/api/v1/repository/${repo.Organisation}/${repo.Repository}/tag/?specificTag=${repo.Tag}`);
    if (!tag.data.tags || tag.data.tags.length == 0) {
      continue;
    }
    const manifest = tag.data.tags[0].manifest_digest;
    const result = await axios.get(`https://quay.io/api/v1/repository/${repo.Organisation}/${repo.Repository}/manifest/${manifest}/security?vulnerabilities=true`);
    let vulnerabilities = [];

    for (let v of result.data.data.Layer.Features) {
      vulnerabilities = [...vulnerabilities, ...v.Vulnerabilities]
    }

    response.push({
      Organisation: repo.Organisation,
      Repository: repo.Repository,
      Tag: repo.Tag,
      Manifest: manifest,
      Vulnerabilities: vulnerabilities
    })
  }

  return response;
}

(async () => {
  const result = await getVulnerabilities(REPOS)
  fs.writeFile('./question_2.result.json', JSON.stringify(result), 'utf8', (err) => {

  })
})()