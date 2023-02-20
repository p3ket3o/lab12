const NAT = [{
  id: "1",
  zone: "us-west1-a",
},
{
  id: "2",
  zone: "us-west1-b",
},
{
  id: "3",
  zone: "us-west1-b",
}
];

const Subnet = [{
  id: "1",
  zone: "us-west1-a",
},
{
  id: "2",
  zone: "us-west1-b",
},
{
  id: "4",
  zone: "us-west1-c",
},
{
  id: "3",
  zone: "us-west1-b",
}
];



function allocate(nats, subnets) {
  if (nats.length == 0 || subnets.length == 0) {
    return
  }

  nats.forEach(x => x.subnets = []);
  const nZones = {};
  const sZones = {};
  for (let i = 0; i < nats.length; i++) {
    if (!nZones[nats[i].zone]) {
      nZones[nats[i].zone] = [i];
    }
    else {
      nZones[nats[i].zone].push(i);
    }
  }

  for (let i = 0; i < subnets.length; i++) {
    if (!sZones[subnets[i].zone]) {
      sZones[subnets[i].zone] = [i];
    }
    else {
      sZones[subnets[i].zone].push(i);
    }
  }
  for (let kn of Object.keys(nZones)) {
    const vn = nZones[kn];
    const vs = sZones[kn];
    if (vs && vs.length > 0) {
      let index = 0;
      for (let i = 0; i < vs.length; i++) {
        nats[vn[index]].subnets.push(subnets[vs[i]]);
        index++;
        if (index == vn.length) {
          index = 0;
        }
      }
    }
  }

  const zones = nats.map(x => x.zone);
  const subExclude = subnets.filter(x => !zones.includes(x.zone));
  if (subExclude && subExclude.length > 0) {
    for (let se of subExclude) {
      nats.sort(function (a, b) { return a.subnets.length - b.subnets.length });
      nats[0].subnets.push(se);
    }
  }
  return nats;
}

console.log(JSON.stringify(allocate(NAT, Subnet)));