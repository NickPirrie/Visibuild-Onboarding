import { useState } from 'react';
import { useStore } from './lib/store.js';
import { getSavedName, saveName } from './lib/api.js';
import NameGate from './components/NameGate.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import ProjectPicker from './components/ProjectPicker.jsx';
import Toast from './components/Toast.jsx';
import PrintView from './components/PrintView.jsx';
import SummaryView from './components/views/SummaryView.jsx';
import ProgrammeView from './components/views/ProgrammeView.jsx';
import TaskListView from './components/views/TaskListView.jsx';
import SubcontractorsView from './components/views/SubcontractorsView.jsx';
import CorrespondencesView from './components/views/CorrespondencesView.jsx';
import CommentsView from './components/views/CommentsView.jsx';
import SettingsView from './components/views/SettingsView.jsx';

export default function App() {
  const [userName, setUserName] = useState(getSavedName());
  const store = useStore(userName);
  const { state, active } = store;

  if (!userName) {
    return <NameGate onSubmit={(n) => { saveName(n); setUserName(n); }} />;
  }

  if (!state.loaded || !active) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vb-ink-3)', fontSize: 14 }}>
        Loading the onboarding portal…
      </div>
    );
  }

  const sec = state.section;
  const isTaskList = sec.indexOf('ws:') === 0 || sec.indexOf('phase:') === 0;

  return (
    <>
      <div className="vb-app">
        <Header userName={userName} saving={state.saving} onOpenPicker={() => store.setPickerOpen(true)} onExport={store.exportPdf} />
        <div className="vb-body">
          <Sidebar state={state} active={active} store={store} onOpenPicker={() => store.setPickerOpen(true)} />
          <main className="vb-main">
            <div className="vb-main-inner">
              {sec === 'summary' && <SummaryView active={active} state={state} store={store} />}
              {sec === 'programme' && <ProgrammeView active={active} state={state} store={store} />}
              {isTaskList && <TaskListView active={active} state={state} store={store} />}
              {sec === 'subs' && <SubcontractorsView active={active} state={state} store={store} />}
              {sec === 'correspondences' && <CorrespondencesView active={active} store={store} />}
              {sec === 'comments' && <CommentsView active={active} store={store} />}
              {sec === 'settings' && <SettingsView active={active} store={store} />}
            </div>
          </main>
        </div>

        {state.pickerOpen && <ProjectPicker state={state} store={store} onClose={() => store.setPickerOpen(false)} />}
        <Toast message={state.toast} />
        <input
          type="file"
          multiple
          ref={store.fileInputRef}
          onChange={store.onFilesPicked}
          style={{ display: 'none' }}
        />
      </div>
      <PrintView active={active} userName={userName} />
    </>
  );
}
