import { useState } from 'react';
import { fileUrl } from '../lib/api.js';
import { fileExt, isImageType, sizeLabel } from '../lib/utils.js';

export default function EvidenceDrop({ evidence, onAttach, onDropFiles, onRemove, thumbSize = 30 }) {
  const [over, setOver] = useState(false);

  return (
    <div
      className={'vb-evidence-drop' + (over ? ' dragover' : '')}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (e.dataTransfer?.files?.length) onDropFiles(e.dataTransfer.files);
      }}
    >
      {(evidence || []).map((e) => {
        const isImage = isImageType(e.type);
        return (
          <div key={e.id} className="vb-evidence-chip">
            {isImage ? (
              <div
                className="vb-evidence-thumb"
                style={{ width: thumbSize, height: thumbSize, backgroundImage: `url("${fileUrl(e.id)}")` }}
              />
            ) : (
              <span className="vb-evidence-file-ext">{fileExt(e.name)}</span>
            )}
            <div style={{ minWidth: 0 }}>
              <div className="vb-evidence-name">{e.name}</div>
              <div className="vb-evidence-size">{sizeLabel(e.size)}</div>
            </div>
            <button
              type="button"
              className="vb-evidence-remove"
              onClick={(ev) => { ev.stopPropagation(); onRemove(e.id); }}
            >×</button>
          </div>
        );
      })}
      <button type="button" className="vb-attach-btn" onClick={onAttach}>＋ Drop or attach evidence</button>
    </div>
  );
}
