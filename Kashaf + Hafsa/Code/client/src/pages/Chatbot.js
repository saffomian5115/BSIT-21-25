import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LANG_LABELS = { english:'🇬🇧 English', urdu:'🇵🇰 اردو', turkish:'🇹🇷 Türkçe' };

const WELCOME = {
  english: {
    title: "Hello! I'm GastroCare AI ",
    sub: "I'm your personalized gastro health assistant. I already know your health profile — ask me anything about stomach health, digestion, diet, or wellness!",
    suggestions: ['I have stomach pain for 3 days','What should I avoid for acid reflux?','I feel bloated after meals','Suggest a diet for my condition','How to improve my digestion?']
  },
  urdu: {
    title: 'السلام علیکم! میں GastroCare AI ہوں ',
    sub: 'میں آپ کی صحت کی پروفائل جانتا ہوں — معدے، ہاضمے، خوراک یا تندرستی کے بارے میں کچھ بھی پوچھیں!',
    suggestions: ['3 دن سے پیٹ میں درد ہے','تیزابیت میں کیا نہ کھاؤں؟','ہر کھانے کے بعد پیٹ پھولتا ہے','میری حالت کے لیے خوراک بتائیں','ہاضمہ بہتر کیسے کریں؟']
  },
  turkish: {
    title: 'Merhaba! Ben GastroCare AI ',
    sub: 'Sağlık profilinizi biliyorum — mide, sindirim, diyet veya sağlık hakkında her şeyi sorabilirsiniz!',
    suggestions: ['3 gündür mide ağrım var','Asit reflü için ne yememeliyim?','Yemekten sonra şişiyorum','Durumuma göre diyet öner','Sindirimimi nasıl iyileştiririm?']
  }
};

const Chatbot = () => {
  const { user } = useAuth();
  const [chats, setChats]               = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [language, setLanguage]         = useState('english');
  const [loading, setLoading]           = useState(false);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [error, setError]               = useState('');
  const bottomRef   = useRef();
  const textareaRef = useRef();

  useEffect(() => { fetchChats(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const fetchChats = async () => {
    try { const { data } = await axios.get('/api/chat'); setChats(data); } catch {}
  };

  const loadChat = async (id) => {
    try {
      const { data } = await axios.get(`/api/chat/${id}`);
      setActiveChatId(id); setMessages(data.messages);
      setLanguage(data.language); setError(''); setSidebarOpen(false);
    } catch { setError('Could not load chat.'); }
  };

  const createNewChat = async (lang = language) => {
    const { data } = await axios.post('/api/chat/new', { language: lang });
    setChats(prev => [data, ...prev]);
    setActiveChatId(data._id); setMessages([]); setError(''); setSidebarOpen(false);
    return data._id;
  };

  const handleNewChat = async () => {
    try { await createNewChat(); }
    catch { setError('Could not create chat. Is the server running?'); }
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat?')) return;
    try {
      await axios.delete(`/api/chat/${id}`);
      setChats(prev => prev.filter(c => c._id !== id));
      if (activeChatId === id) { setActiveChatId(null); setMessages([]); }
    } catch { setError('Could not delete chat.'); }
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setError(''); setInput(''); setLoading(true);

    let chatId = activeChatId;
    if (!chatId) {
      try { chatId = await createNewChat(); }
      catch { setError('Could not create chat. Make sure server is running.'); setLoading(false); return; }
    }

    setMessages(prev => [...prev, { role:'user', content:trimmed, timestamp:new Date() }]);

    try {
      const { data } = await axios.post(`/api/chat/${chatId}/message`, { message:trimmed, language });
      setMessages(prev => [...prev, {
        role:'assistant', content:data.response,
        timestamp:new Date(), isEmergency:data.isEmergency, isBlocked:data.isBlocked
      }]);
      if (data.title) setChats(prev => prev.map(c => c._id === chatId ? {...c, title:data.title} : c));
    } catch (err) {
      setMessages(prev => [...prev, {
        role:'assistant',
        content:`⚠️ ${err.response?.data?.message || 'Server error. Check if backend is running.'}`,
        timestamp:new Date()
      }]);
    } finally { setLoading(false); }
  };

  const handleKeyDown = e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const fmtTime = ts => ts ? new Date(ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '';
  const initial  = user?.name?.[0]?.toUpperCase() || 'U';
  const welcome  = WELCOME[language];

  return (
    <div className="page-pt">
      <div className="gc-chatbot-wrap">
        {sidebarOpen && <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{zIndex:800}} onClick={()=>setSidebarOpen(false)}/>}

        {/* ── Sidebar ── */}
        <div className={`gc-sidebar ${sidebarOpen?'show':''}`}>
          <div className="gc-sidebar-head">
            <h5 className="mb-0"><i className="bi bi-chat-dots me-2"/>Chats</h5>
            <button className="gc-new-btn mt-2" onClick={handleNewChat}>
              <i className="bi bi-plus-lg me-1"/>New Chat
            </button>
            <select className="gc-lang-select" value={language} onChange={e=>setLanguage(e.target.value)}>
              <option value="english">🇬🇧 English</option>
              <option value="urdu">🇵🇰 Urdu / اردو</option>
              <option value="turkish">🇹🇷 Türkçe</option>
            </select>
          </div>
          <div className="gc-chat-list">
            {chats.length===0 ? (
              <p className="text-center py-4" style={{color:'rgba(255,255,255,.4)',fontSize:'.8rem'}}>No chats yet.<br/>Click "New Chat"!</p>
            ) : chats.map(c=>(
              <div key={c._id} className={`gc-chat-item ${activeChatId===c._id?'active':''}`} onClick={()=>loadChat(c._id)}>
                <i className="bi bi-chat-left-text me-2" style={{fontSize:'.8rem',opacity:.6}}/>
                <span className="gc-chat-item-title">{c.title}</span>
                <button className="gc-del-btn" onClick={e=>deleteChat(c._id,e)}><i className="bi bi-trash3"/></button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Chat ── */}
        <div className="gc-chat-main">
          <div className="gc-chat-header">
            <button className="btn btn-sm d-lg-none me-2 p-1" style={{color:'var(--gc-primary)'}} onClick={()=>setSidebarOpen(true)}>
              <i className="bi bi-list fs-5"/>
            </button>
            <div className="gc-chat-header-icon">🤖</div>
            <div>
              <div className="fw-semibold" style={{color:'var(--gc-primary-dark)'}}>GastroCare AI</div>
              <div className="text-muted small d-flex align-items-center gap-1">
                <span style={{width:7,height:7,borderRadius:'50%',background:'#27ae60',display:'inline-block'}}/>
                Online · {LANG_LABELS[language]} · Personalized for {user?.name?.split(' ')[0]}
              </div>
            </div>
            <div className="ms-auto d-flex gap-2 align-items-center">
              <span className="badge rounded-pill d-none d-md-inline" style={{background:'rgba(10,79,60,.1)',color:'var(--gc-primary)',fontSize:'.72rem'}}>
                <i className="bi bi-person-check me-1"/>Profile Linked
              </span>
              <button className="btn btn-sm btn-outline-secondary" onClick={handleNewChat}>
                <i className="bi bi-plus me-1"/>New
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-warning alert-dismissible m-2 py-2 mb-0" style={{fontSize:'.85rem'}}>
              <i className="bi bi-exclamation-triangle me-2"/>{error}
              <button className="btn-close btn-sm" onClick={()=>setError('')}/>
            </div>
          )}

          <div className="gc-messages">
            {messages.length===0 ? (
              <div className="gc-welcome">
                <div className="gc-welcome-icon">🏥</div>
                <h4 style={{color:'var(--gc-primary)'}}>{welcome.title}</h4>
                <p className="text-muted" style={{maxWidth:480,margin:'0 auto 20px',fontSize:'.95rem'}}>{welcome.sub}</p>
                {/* Profile linked badge */}
                <div className="mb-3">
                  <span className="badge px-3 py-2 rounded-pill" style={{background:'rgba(10,79,60,.1)',color:'var(--gc-primary)',fontSize:'.8rem'}}>
                    <i className="bi bi-person-heart me-1"/>Your health profile is loaded — I know your medical history!
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {welcome.suggestions.map(q=>(
                    <button key={q} className="btn btn-sm btn-outline-secondary rounded-pill" style={{fontSize:'.82rem'}} onClick={()=>sendMessage(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : messages.map((m,i)=>(
              <div key={i} className={`gc-msg ${m.role==='user'?'user':'ai'} ${m.isEmergency?'emergency':''}`}>
                <div className="gc-msg-avatar">{m.role==='user'?initial:'🤖'}</div>
                <div style={{maxWidth:'100%'}}>
                  {m.isEmergency && <div className="mb-2"><span className="badge bg-danger"><i className="bi bi-exclamation-triangle-fill me-1"/>Emergency Detected</span></div>}
                  {m.isBlocked && <div className="mb-2"><span className="badge" style={{background:'rgba(10,79,60,.1)',color:'var(--gc-primary)'}}><i className="bi bi-shield-check me-1"/>Health Topics Only</span></div>}
                  <div className="gc-msg-bubble" style={{whiteSpace:'pre-wrap',wordBreak:'break-word'}}>{m.content}</div>
                  <div className={`gc-msg-time ${m.role==='user'?'text-end':''}`}>{fmtTime(m.timestamp)}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="gc-msg ai">
                <div className="gc-msg-avatar">🤖</div>
                <div className="gc-msg-bubble"><div className="gc-typing"><span/><span/><span/></div></div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          <div className="gc-input-area">
            <div className="gc-input-row">
              <textarea ref={textareaRef} className="gc-textarea" rows={1}
                value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={handleKeyDown} disabled={loading}
                placeholder={
                  language==='urdu'    ? 'صحت سے متعلق سوال لکھیں... (Enter = بھیجیں)' :
                  language==='turkish' ? 'Sağlık sorunuzu yazın... (Enter = Gönder)' :
                  'Type your health question... (Enter to send)'}
              />
              <button className="gc-send-btn" disabled={loading||!input.trim()} onClick={()=>sendMessage()}>
                {loading ? <span className="spinner-border spinner-border-sm"/> : <i className="bi bi-send-fill"/>}
              </button>
            </div>
            <p className="text-center mt-2 mb-0" style={{fontSize:'.72rem',color:'var(--gc-text-light)'}}>
              <i className="bi bi-robot me-1"/><i className="bi bi-shield-check me-1"/>Health topics only · Not a substitute for professional medical advice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chatbot;
