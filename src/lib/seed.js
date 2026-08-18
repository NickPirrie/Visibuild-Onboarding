import { WORKSTREAM_DEFS } from './constants.js';

function mkWorkstreams() {
  return WORKSTREAM_DEFS.map(([id, name]) => ({ id, name, tasks: [] }));
}

function roleFor(name) {
  if (/Visibuild|Nick/.test(name)) return 'Visibuild CS';
  if (/Doyle|Reilly|Multiplex|Global Switch|Capital|Bishop|Client|Costa|Bruno/.test(name)) return 'Client';
  return 'Trade partner';
}

function put(project, wsId, rows) {
  const w = project.workstreams.find((x) => x.id === wsId);
  if (!w) return;
  rows.forEach((r, i) => {
    w.tasks.push({
      id: wsId + '-' + (i + 1) + '-' + project.id,
      title: r[0],
      owner: r[1],
      role: roleFor(r[1]),
      phase: r[2],
      status: r[3],
      start: r[4],
      due: r[5],
      notes: r[6] ? [{ id: wsId + '-' + (i + 1) + '-n-' + project.id, text: r[6] }] : [],
      evidence: [],
    });
  });
}

export function seedProjects() {
  const a = {
    id: 'p-99cr',
    client: 'Multiplex',
    name: '99 City Road',
    code: '99CR',
    sector: 'Mixed-use · 36-level development',
    region: 'London',
    csOwner: 'Nick P.',
    start: '2026-06-15',
    golive: '2026-08-17',
    phase1End: '2026-07-15',
    phase2End: '2026-08-14',
    workstreams: mkWorkstreams(),
    correspondences: [],
    comments: [],
    subcontractors: [],
  };

  put(a, 'loc', [
    ['Schedule model review session to understand project hierarchy', 'Nick P.', '30', 'done', '2026-06-15', '2026-07-10', 'Meeting booked with Bianca 10/07 to review model hierarchy'],
    ['Confirm naming conventions & project zones for the location tree', 'Multiplex', '30', 'done', '2026-06-15', '2026-07-10', 'Reviewed with Bianca 10/07'],
    ['Build location tree aligned to Vista naming conventions', 'Nick P.', '60', 'in_progress', '2026-07-13', '2026-07-24', 'JT issued mark-up pack 15/07. NP updating tree; wider-team review targeted for Fri 24/07 after the 14/07 session with John & Simon'],
    ['Validate location tree, templates & milestones', 'Nick P.', '90', 'not_started', '2026-07-27', '2026-08-17', ''],
  ]);
  put(a, 'tpl', [
    ['Digitise ITPs and critical checks', 'Nick P.', '30', 'done', '2026-06-15', '2026-07-12', 'Erith ITPs digitised. Any other ITPs to be issued to Visibuild'],
    ['Issue MPX critical check inspections', 'Multiplex', '30', 'not_started', '2026-06-15', '2026-07-12', 'Yet to be issued'],
    ['Issue subcontractor ITPs / ITCs', 'Multiplex', '60', 'not_started', '2026-07-13', '2026-07-26', ''],
    ['Digitise all subcontractor ITPs', 'Nick P.', '90', 'not_started', '2026-07-27', '2026-08-17', ''],
  ]);
  put(a, 'train', [
    ['Train core team members', 'Nick P.', '30', 'in_progress', '2026-06-15', '2026-07-12', 'Ongoing — training to take place July / August'],
    ['Deliver Multiplex internal training', 'Nick P.', '60', 'not_started', '2026-07-13', '2026-07-26', ''],
    ['Familiarisation with the Visibuild platform & functionality', 'Multiplex', '60', 'not_started', '2026-07-13', '2026-07-26', ''],
    ['Review Visibuild tracking tools', 'Multiplex', '60', 'not_started', '2026-07-13', '2026-07-26', ''],
    ['Organise further training sessions as required', 'Multiplex', '60', 'not_started', '2026-07-13', '2026-07-26', ''],
    ['Train up MPX QA Manager', 'Multiplex', '60', 'not_started', '2026-07-13', '2026-07-26', ''],
    ['Deliver subcontractor group training sessions on site', 'Multiplex', '90', 'not_started', '2026-07-27', '2026-08-17', 'Erith trained & onboarded first'],
  ]);
  put(a, 'prog', [
    ['Send detailed onboarding plan with clear actions & timelines', 'Nick P.', '30', 'done', '2026-06-15', '2026-07-12', ''],
    ['Issue project org chart', 'Multiplex', '30', 'done', '2026-06-15', '2026-07-12', 'Issued'],
    ['Issue full subcontractor list for the project', 'Multiplex', '30', 'in_progress', '2026-06-15', '2026-07-12', 'Key subcontractors have been issued'],
    ['Provide programme for sequencing alignment', 'Multiplex', '30', 'not_started', '2026-06-15', '2026-07-12', 'Programme to be issued'],
  ]);
  put(a, 'golive', [
    ['Configure platform: users, roles & permissions', 'Nick P.', '30', 'in_progress', '2026-06-15', '2026-07-12', 'Erith governance ongoing'],
    ['Establish reviewer workflows for different inspection types', 'Nick P.', '60', 'not_started', '2026-07-13', '2026-07-26', ''],
    ['Transition QA onto Visibuild', 'Multiplex', '60', 'not_started', '2026-07-13', '2026-07-26', 'MPX critical checks + subcontractor QA'],
    ['Review KPIs defined by Multiplex', 'Multiplex', '60', 'not_started', '2026-07-13', '2026-07-26', 'Yet to be issued'],
    ['Review subcontractor quality in Visibuild', 'Multiplex', '90', 'not_started', '2026-07-27', '2026-08-17', ''],
    ['Review features e.g. QR codes to assist on-site works', 'Multiplex', '90', 'not_started', '2026-07-27', '2026-08-17', ''],
    ['Drive consistent adoption across the project', 'Multiplex', '90', 'not_started', '2026-07-27', '2026-08-17', ''],
    ['Dry-run: concrete pour checks & pre-sheet inspections with Erith', 'Multiplex + Visibuild', '90', 'not_started', '2026-07-27', '2026-08-17', 'Joint Visibuild + Multiplex exercise'],
  ]);

  a.correspondences = [
    { id: 'c1', date: '2026-07-15', who: 'John (Multiplex)', channel: 'email', summary: 'JT issued the location-tree mark-up pack. NP to update the tree; aiming for a wider-team review meeting Fri 24/07.', attachments: [] },
    { id: 'c2', date: '2026-07-14', who: 'John & Simon (Multiplex)', channel: 'meeting', summary: 'Location tree review. A further meeting with the wider team is required before sign-off.', attachments: [] },
    { id: 'c3', date: '2026-07-10', who: 'Bianca (Multiplex)', channel: 'meeting', summary: 'Model review session to confirm project hierarchy and naming conventions for the location tree.', attachments: [] },
    { id: 'c4', date: '2026-06-09', who: 'Erith', channel: 'meeting', summary: 'Kick-start onboarding session. ITPs since digitised — Erith is the first trade to be trained and onboarded.', attachments: [] },
  ];
  a.comments = [
    { id: 'm1', author: 'Nick P.', when: '15 Jul', text: 'Location tree is the critical path — JT mark-up pack landed 15/07, targeting a wider-team review Fri 24/07 before sign-off. Everything downstream (façade ITCs, subcontractor ITPs) waits on it.' },
    { id: 'm2', author: 'Nick P.', when: '20 Jul', text: 'Erith is trained, onboarded and ITPs digitised — first trade live. Hares onsite Jan 2027, so plenty of runway. Org chart done; chasing Multiplex on the programme and the full subcontractor list.' },
  ];
  a.subcontractors = [
    {
      id: 's1', name: 'Erith', trades: [
        { id: 's1t1', name: 'Site works · onsite Aug 2026',
          itps: [{ id: 's1t1i0', title: 'ITP submission & digitisation', status: 'done', owner: 'Erith', role: 'Trade partner', phase: '30', due: '2026-07-01', evidence: [] }],
          training: [{ id: 's1t1r0', title: 'Initial onboarding session', status: 'done', owner: 'Erith', role: 'Trade partner', phase: '30', due: '2026-06-30', evidence: [] }] },
      ],
    },
    {
      id: 's2', name: 'Hares', trades: [
        { id: 's2t1', name: 'Site works · onsite Jan 2027',
          itps: [{ id: 's2t1i0', title: 'ITP submission & digitisation', status: 'not_started', owner: 'Hares', role: 'Trade partner', phase: '90', due: '2026-12-15', evidence: [] }],
          training: [{ id: 's2t1r0', title: 'Field training', status: 'not_started', owner: 'Hares', role: 'Trade partner', phase: '90', due: '2026-12-20', evidence: [] }] },
      ],
    },
  ];

  return [a];
}

export function newProject() {
  const id = 'p-' + Date.now().toString(36);
  const today = new Date().toISOString().slice(0, 10);
  const golive = new Date();
  golive.setDate(golive.getDate() + 90);
  return {
    id,
    name: 'New project',
    client: 'Client',
    code: 'NEW',
    sector: 'Sector · Type',
    region: 'Region',
    start: today,
    golive: golive.toISOString().slice(0, 10),
    phase1End: new Date(new Date(today).setDate(new Date(today).getDate() + 30)).toISOString().slice(0, 10),
    phase2End: new Date(new Date(today).setDate(new Date(today).getDate() + 60)).toISOString().slice(0, 10),
    csOwner: '',
    workstreams: mkWorkstreams(),
    subcontractors: [],
    correspondences: [],
    comments: [],
  };
}
