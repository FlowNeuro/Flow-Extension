// Self-contained styles for the Shadow DOM. No YouTube or Flow CSS is imported.
export const STYLES = `
:host { all: initial; }
* { box-sizing: border-box; font-family: "Roboto", system-ui, -apple-system, sans-serif; }

.flow-row { display: inline-flex; gap: 8px; align-items: center; }

.flow-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 14px;
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 18px;
  background: rgba(255,255,255,0.08);
  color: #f1f1f1;
  font-size: 14px; font-weight: 500; line-height: 1;
  cursor: pointer; white-space: nowrap;
  transition: background .15s ease, border-color .15s ease;
}
.flow-btn:hover { background: rgba(255,255,255,0.16); }
.flow-btn:active { transform: translateY(1px); }
.flow-btn:focus-visible { outline: 2px solid #ff5252; outline-offset: 2px; }
.flow-btn--primary { background: #ff0000; border-color: transparent; color: #fff; }
.flow-btn--primary:hover { background: #d90000; }
.flow-btn--icon { height: 30px; width: 30px; padding: 0; border-radius: 50%; justify-content: center; }
.flow-btn__icon { display: inline-flex; }
.flow-btn__label:empty { display: none; }

.flow-overlay {
  position: fixed; top: 0; left: 0;
  display: none; gap: 6px; padding: 4px;
  border-radius: 21px; background: rgba(15,15,17,0.86);
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  pointer-events: auto;
}
.flow-overlay.is-visible { display: inline-flex; }
.flow-overlay .flow-btn {
  color: #fff; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.12);
}
.flow-overlay .flow-btn:hover { background: rgba(255,255,255,0.24); }

.flow-toasts {
  position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  pointer-events: none;
}
.flow-toast {
  display: inline-flex; align-items: center; gap: 12px;
  max-width: 90vw; padding: 10px 16px;
  border-radius: 10px;
  background: #1f1f22; color: #f1f1f1;
  border: 1px solid rgba(255,255,255,0.12);
  font-size: 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.4);
  opacity: 0; transform: translateY(8px);
  transition: opacity .2s ease, transform .2s ease;
  pointer-events: auto;
}
.flow-toast.is-visible { opacity: 1; transform: translateY(0); }
.flow-toast--error { border-color: rgba(255,99,99,0.5); }
.flow-toast--success { border-color: rgba(88,214,141,0.45); }
.flow-toast__msg { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.flow-toast__cta {
  flex: none; border: 0; border-radius: 6px; padding: 6px 12px;
  background: #ff0000; color: #fff; font-weight: 600; font-size: 13px; cursor: pointer;
}
.flow-toast__cta:hover { background: #d90000; }

@media (prefers-color-scheme: light) {
  .flow-btn { color: #0f0f0f; border-color: rgba(0,0,0,0.15); background: rgba(0,0,0,0.05); }
  .flow-btn:hover { background: rgba(0,0,0,0.1); }
  .flow-btn--primary { color: #fff; }
}
`;
