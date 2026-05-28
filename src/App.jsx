import { useState, useEffect, useReducer } from "react";

const COLORS = {
    bg: "#0f0e17", card: "#1a1829", accent: "#ff6b35", accent2: "#f7c59f",
    purple: "#a855f7", green: "#22c55e", red: "#ef4444", yellow: "#f59e0b",
    text: "#fffffe", muted: "#94a3b8", border: "#2e2b45",
};

const S = {
    app: { minHeight:"100vh", background:COLORS.bg, fontFamily:"'Georgia', serif", color:COLORS.text, padding:"24px 16px 48px", boxSizing:"border-box" },
    maxW: { maxWidth:"640px", margin:"0 auto" },
    header: { textAlign:"center", marginBottom:"28px" },
    logo: { fontSize:"12px", letterSpacing:"4px", color:COLORS.accent, textTransform:"uppercase", marginBottom:"6px" },
    title: { fontSize:"clamp(26px,5vw,42px)", fontWeight:"bold", background:`linear-gradient(135deg,${COLORS.text},${COLORS.accent2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:"0 0 6px", lineHeight:1.2 },
    sub: { color:COLORS.muted, fontSize:"14px", margin:0 },
    card: { background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:"16px", padding:"20px", marginBottom:"14px" },
    label: { display:"block", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:COLORS.accent, marginBottom:"8px", fontFamily:"monospace" },
    textarea: { width:"100%", minHeight:"120px", background:"#13121f", border:`1px solid ${COLORS.border}`, borderRadius:"10px", color:COLORS.text, fontSize:"14px", padding:"12px", resize:"vertical", fontFamily:"'Georgia',serif", lineHeight:1.6, boxSizing:"border-box", outline:"none" },
    row: { display:"flex", gap:"10px", marginTop:"14px", flexWrap:"wrap" },
    select: { flex:1, minWidth:"110px", background:"#13121f", border:`1px solid ${COLORS.border}`, borderRadius:"10px", color:COLORS.text, fontSize:"13px", padding:"9px 11px", outline:"none", fontFamily:"'Georgia',serif" },
    input: { background:"#13121f", border:`1px solid ${COLORS.border}`, borderRadius:"10px", color:COLORS.text, fontSize:"13px", padding:"9px 11px", outline:"none", fontFamily:"'Georgia',serif", width:"100%", boxSizing:"border-box", marginBottom:"12px" },
    btn: { background:`linear-gradient(135deg,${COLORS.accent},#e85d20)`, color:"#fff", border:"none", borderRadius:"10px", padding:"10px 20px", fontSize:"14px", fontWeight:"bold", cursor:"pointer", fontFamily:"'Georgia',serif", whiteSpace:"nowrap" },
    btnSm: { background:"transparent", border:`1px solid ${COLORS.border}`, borderRadius:"8px", color:COLORS.text, padding:"7px 14px", cursor:"pointer", fontSize:"13px", fontFamily:"'Georgia',serif" },
    loading: { textAlign:"center", padding:"48px 24px", color:COLORS.muted },
    spinner: { width:"36px", height:"36px", border:`3px solid ${COLORS.border}`, borderTopColor:COLORS.accent, borderRadius:"50%", margin:"0 auto 14px", animation:"spin 0.8s linear infinite" },
    optionBtn: { display:"block", width:"100%", textAlign:"left", background:"#13121f", border:`1px solid ${COLORS.border}`, borderRadius:"10px", color:COLORS.text, fontSize:"14px", padding:"12px 14px", marginBottom:"8px", cursor:"pointer", fontFamily:"'Georgia',serif", lineHeight:1.4 },
    optionCorrect: { background:"rgba(34,197,94,0.15)", borderColor:COLORS.green, color:COLORS.green },
    optionWrong: { background:"rgba(239,68,68,0.15)", borderColor:COLORS.red, color:COLORS.red },
    explanation: { marginTop:"12px", padding:"11px 14px", background:"rgba(168,85,247,0.1)", borderRadius:"10px", border:`1px solid rgba(168,85,247,0.3)`, color:COLORS.accent2, fontSize:"13px", lineHeight:1.6 },
    adBanner: { background:"linear-gradient(135deg,#1e1b2e,#2a2440)", border:`1px dashed ${COLORS.border}`, borderRadius:"10px", padding:"12px", textAlign:"center", marginBottom:"14px", color:COLORS.muted, fontSize:"11px", letterSpacing:"1px" },
    tab: { display:"flex", gap:"4px", marginBottom:"16px", background:"#13121f", borderRadius:"12px", padding:"4px" },
    tabBtn: (active) => ({ flex:1, padding:"9px", borderRadius:"9px", border:"none", cursor:"pointer", fontSize:"13px", fontFamily:"'Georgia',serif", fontWeight:active?"bold":"normal", background:active?COLORS.accent:"transparent", color:active?"#fff":COLORS.muted }),
    savedItem: { background:"#13121f", border:`1px solid ${COLORS.border}`, borderRadius:"12px", padding:"14px 16px", marginBottom:"10px" },
    badge: (color) => ({ display:"inline-block", fontSize:"10px", letterSpacing:"1px", textTransform:"uppercase", background:`${color}22`, color, borderRadius:"5px", padding:"2px 8px", fontFamily:"monospace" }),
    wrongItem: { background:"#13121f", border:`1px solid rgba(239,68,68,0.3)`, borderRadius:"12px", padding:"14px", marginBottom:"10px" },
    progressTrack: { height:"6px", background:COLORS.border, borderRadius:"3px", marginBottom:"16px", overflow:"hidden" },
    demoBadge: { background:"rgba(245,158,11,0.15)", border:`1px solid ${COLORS.yellow}`, borderRadius:"8px", padding:"8px 14px", marginBottom:"14px", textAlign:"center", color:COLORS.yellow, fontSize:"12px" },
};

const STAGE = { INPUT:"input", LOADING:"loading", QUIZ:"quiz", RESULT:"result" };
const TAB = { HOME:"home", SAVED:"saved", WRONG:"wrong" };

// 샘플 퀴즈 데이터
const SAMPLE_BANKS = {
    science: [
        { question:"지구에서 가장 가까운 별은?", options:["A. 시리우스","B. 태양","C. 북극성","D. 안타레스"], answer:1, explanation:"태양은 지구에서 약 1억 5천만 km 거리에 있는 가장 가까운 별입니다." },
        { question:"물의 화학식은?", options:["A. CO2","B. H2O2","C. H2O","D. HO"], answer:2, explanation:"물은 수소 2개와 산소 1개로 이루어진 H2O입니다." },
        { question:"빛의 속도는 약 얼마인가요?", options:["A. 30만 km/s","B. 3만 km/s","C. 300만 km/s","D. 3억 km/s"], answer:0, explanation:"빛의 속도는 진공에서 약 299,792km/s, 즉 약 30만 km/s입니다." },
        { question:"인체에서 가장 큰 기관은?", options:["A. 간","B. 폐","C. 피부","D. 뇌"], answer:2, explanation:"피부는 인체에서 가장 큰 기관으로, 성인 기준 약 1.5~2㎡의 면적을 가집니다." },
        { question:"DNA의 이중나선 구조를 발견한 사람은?", options:["A. 아인슈타인","B. 왓슨과 크릭","C. 다윈","D. 파스퇴르"], answer:1, explanation:"제임스 왓슨과 프랜시스 크릭이 1953년 DNA의 이중나선 구조를 발견했습니다." },
    ],
    history: [
        { question:"한글을 창제한 조선의 왕은?", options:["A. 태조","B. 세조","C. 세종대왕","D. 성종"], answer:2, explanation:"세종대왕은 1443년 훈민정음(한글)을 창제하였습니다." },
        { question:"제1차 세계대전이 시작된 연도는?", options:["A. 1910년","B. 1914년","C. 1918년","D. 1939년"], answer:1, explanation:"제1차 세계대전은 1914년 사라예보 사건을 계기로 시작되었습니다." },
        { question:"임진왜란이 발발한 해는?", options:["A. 1492년","B. 1592년","C. 1692년","D. 1392년"], answer:1, explanation:"임진왜란은 1592년 일본이 조선을 침략하면서 시작되었습니다." },
        { question:"삼국시대의 세 나라가 아닌 것은?", options:["A. 고구려","B. 백제","C. 발해","D. 신라"], answer:2, explanation:"삼국시대는 고구려, 백제, 신라 세 나라를 말합니다. 발해는 통일신라 시대에 세워진 나라입니다." },
        { question:"프랑스 혁명이 일어난 연도는?", options:["A. 1776년","B. 1789년","C. 1804년","D. 1815년"], answer:1, explanation:"프랑스 혁명은 1789년에 시작되어 절대왕정을 무너뜨렸습니다." },
    ],
    general: [
        { question:"세계에서 가장 높은 산은?", options:["A. K2","B. 에베레스트","C. 킬리만자로","D. 몽블랑"], answer:1, explanation:"에베레스트는 해발 8,848m로 세계에서 가장 높은 산입니다." },
        { question:"올림픽은 몇 년마다 열리나요?", options:["A. 2년","B. 3년","C. 4년","D. 5년"], answer:2, explanation:"하계 올림픽과 동계 올림픽 모두 4년마다 열립니다." },
        { question:"태양계에서 가장 큰 행성은?", options:["A. 토성","B. 목성","C. 천왕성","D. 해왕성"], answer:1, explanation:"목성은 태양계에서 가장 큰 행성으로, 지구 질량의 약 318배입니다." },
        { question:"물이 끓는 온도는 (1기압 기준)?", options:["A. 90°C","B. 95°C","C. 100°C","D. 110°C"], answer:2, explanation:"물은 1기압(해수면)에서 100°C에서 끓습니다." },
        { question:"대한민국의 수도는?", options:["A. 부산","B. 인천","C. 대전","D. 서울"], answer:3, explanation:"대한민국의 수도는 서울특별시입니다." },
    ],
};

let memStorage = {};
const store = {
    get: (k) => { try { return JSON.parse(memStorage[k]||"null"); } catch { return null; } },
    set: (k,v) => { memStorage[k] = JSON.stringify(v); },
};

export default function App() {
    const [tab, setTab] = useState(TAB.HOME);
    const [stage, setStage] = useState(STAGE.INPUT);
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [count, setCount] = useState("5");
    const [difficulty, setDifficulty] = useState("medium");
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [saved, setSaved] = useState(() => store.get("quizzes") || []);
    const [wrong, setWrong] = useState(() => store.get("wrong") || []);
    const [reviewMode, setReviewMode] = useState(false);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('oai_key') || '');
    const [, forceUpdate] = useReducer(x=>x+1,0);

    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `@keyframes spin{to{transform:rotate(360deg)}} button:hover{opacity:0.85}`;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    async function generateQuiz() {
        if (!text.trim()) return;
        if (!apiKey.trim()) {
            alert('API 키를 먼저 입력해주세요!');
            return;
        }
        setStage(STAGE.LOADING);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [{
                        role: 'user',
                        content: `다음 주제로 4지선다 퀴즈 ${count}개를 만들어주세요: ${text}

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만:
[
  {
    "question": "질문",
    "options": ["A. 보기1", "B. 보기2", "C. 보기3", "D. 보기4"],
    "answer": 0,
    "explanation": "해설"
  }
]`
                    }],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || 'API 오류');
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            const clean = content.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(clean);

            setQuestions(parsed);
            setAnswers(new Array(parsed.length).fill(null));
            setCurrent(0);
            setSelected(null);
            setStage(STAGE.QUIZ);

        } catch (error) {
            console.error('오류:', error);
            alert(`퀴즈 생성 실패: ${error.message}`);
            setStage(STAGE.INPUT);
        }
    }
    function selectOption(idx) {
        if (selected !== null) return;
        setSelected(idx);
        const newAnswers = [...answers];
        newAnswers[current] = idx;
        setAnswers(newAnswers);
    }

    function goNext() {
        if (current < questions.length-1) {
            setCurrent(current+1);
            setSelected(answers[current+1]);
        } else {
            finishQuiz();
        }
    }

    function goPrev() {
        if (current > 0) { setCurrent(current-1); setSelected(answers[current-1]); }
    }

    function finishQuiz() {
        const cur = store.get("wrong") || [];
        const newWrong = [...cur];
        questions.forEach((q,i) => {
            if (answers[i] !== null && answers[i] !== q.answer) {
                const exists = newWrong.find(w=>w.question===q.question);
                if (!exists) newWrong.push({...q, wrongCount:1, quizTitle:title||"퀴즈"});
                else exists.wrongCount = (exists.wrongCount||1)+1;
            }
        });
        store.set("wrong", newWrong);
        setWrong(newWrong);
        setStage(STAGE.RESULT);
    }

    function saveQuiz() {
        const cur = store.get("quizzes") || [];
        const quiz = { id:Date.now(), title:title||`퀴즈 ${cur.length+1}`, questions, difficulty, createdAt:new Date().toLocaleDateString("ko-KR"), count:questions.length };
        const updated = [quiz, ...cur];
        store.set("quizzes", updated);
        setSaved(updated);
        alert("저장됐어요! 📚");
    }

    function loadQuiz(quiz) {
        setQuestions(quiz.questions);
        setAnswers(new Array(quiz.questions.length).fill(null));
        setCurrent(0); setSelected(null);
        setTitle(quiz.title); setReviewMode(false);
        setStage(STAGE.QUIZ); setTab(TAB.HOME);
    }

    function deleteQuiz(id) {
        const updated = saved.filter(q=>q.id!==id);
        store.set("quizzes", updated); setSaved(updated);
    }

    function deleteWrong(question) {
        const updated = wrong.filter(w=>w.question!==question);
        store.set("wrong", updated); setWrong(updated);
    }

    function startWrongReview() {
        if (!wrong.length) return;
        setQuestions(wrong);
        setAnswers(new Array(wrong.length).fill(null));
        setCurrent(0); setSelected(null);
        setTitle("오답 복습"); setReviewMode(true);
        setStage(STAGE.QUIZ); setTab(TAB.HOME);
    }

    function reset() {
        setStage(STAGE.INPUT); setText(""); setTitle("");
        setQuestions([]); setAnswers([]);
        setSelected(null); setCurrent(0); setReviewMode(false);
    }

    const correctCount = answers.filter((a,i)=>a===questions[i]?.answer).length;

    return (
        <div style={S.app}>
            <div style={S.maxW}>
                <div style={S.header}>
                    <p style={S.logo}>✦ AI Quiz Maker</p>
                    <h1 style={S.title}>공부한 내용을<br/>퀴즈로 만들어보세요</h1>
                    <p style={S.sub}>AI가 즉시 퀴즈 생성 · 저장 · 오답 복습</p>
                </div>

                <div style={S.adBanner}>📢 광고 영역 — Google AdMob 연동 시 수익 발생</div>

                {/* 데모 안내 */}
                {stage === STAGE.INPUT && (
                    <div style={S.demoBadge}>
                        🧪 데모 버전 — 샘플 퀴즈로 모든 기능을 미리 체험해보세요!<br/>
                        <span style={{fontSize:"11px", opacity:0.8}}>힌트: "과학", "역사" 키워드를 입력하면 관련 퀴즈가 나와요</span>
                    </div>
                )}

                {stage === STAGE.INPUT && (
                    <div style={S.tab}>
                        {[{id:TAB.HOME,label:"🏠 홈"},{id:TAB.SAVED,label:`📚 저장 (${saved.length})`},{id:TAB.WRONG,label:`❌ 오답 (${wrong.length})`}].map(t=>(
                            <button key={t.id} style={S.tabBtn(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>
                        ))}
                    </div>
                )}

                {/* HOME */}
                {stage===STAGE.INPUT && tab===TAB.HOME && (
                    <div style={S.card}>
                        <label style={S.label}>OpenAI API 키</label>
                        <input   // ← 이게 없어요!
                            style={S.input}
                            type="password"
                            placeholder="sk-..."
                            value={apiKey}
                            onChange={e => {
                                setApiKey(e.target.value);
                                localStorage.setItem('oai_key', e.target.value);
                            }}
                        />
                        <label style={S.label}>퀴즈 제목 (선택)</label>
                        <input style={S.input} placeholder="예: 한국사 3단원" value={title} onChange={e=>setTitle(e.target.value)} />
                        <label style={S.label}>공부 내용 입력</label>
                        <textarea style={S.textarea} placeholder='"과학", "역사" 등 주제를 입력해보세요...' value={text} onChange={e=>setText(e.target.value)} />
                        <div style={S.row}>
                            <select style={S.select} value={count} onChange={e=>setCount(e.target.value)}>
                                <option value="3">3문제</option>
                                <option value="5">5문제</option>
                            </select>
                            <select style={S.select} value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                                <option value="easy">쉬움</option>
                                <option value="medium">보통</option>
                                <option value="hard">어려움</option>
                            </select>
                            <button style={{...S.btn, opacity:text.trim()?1:0.5}} onClick={generateQuiz} disabled={!text.trim()}>
                                퀴즈 생성 →
                            </button>
                        </div>
                    </div>
                )}

                {/* SAVED */}
                {stage===STAGE.INPUT && tab===TAB.SAVED && (
                    saved.length===0 ? (
                        <div style={{...S.card, textAlign:"center", color:COLORS.muted, padding:"32px"}}>
                            <p style={{fontSize:"32px",marginBottom:"8px"}}>📭</p>
                            <p>저장된 퀴즈가 없어요.<br/>퀴즈를 풀고 저장해보세요!</p>
                        </div>
                    ) : saved.map(q=>(
                        <div key={q.id} style={S.savedItem}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"8px"}}>
                                <div>
                                    <p style={{margin:"0 0 5px",fontWeight:"bold",fontSize:"15px"}}>{q.title}</p>
                                    <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                                        <span style={S.badge(COLORS.accent)}>{q.count}문제</span>
                                        <span style={S.badge(COLORS.muted)}>{q.createdAt}</span>
                                    </div>
                                </div>
                                <div style={{display:"flex",gap:"6px"}}>
                                    <button style={S.btn} onClick={()=>loadQuiz(q)}>풀기</button>
                                    <button style={{...S.btnSm,color:COLORS.red,borderColor:"rgba(239,68,68,0.3)"}} onClick={()=>deleteQuiz(q.id)}>삭제</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* WRONG */}
                {stage===STAGE.INPUT && tab===TAB.WRONG && (
                    <>
                        {wrong.length>0 && (
                            <div style={{marginBottom:"12px",display:"flex",justifyContent:"flex-end"}}>
                                <button style={{...S.btn,background:`linear-gradient(135deg,${COLORS.purple},#7c3aed)`}} onClick={startWrongReview}>
                                    🔁 오답만 다시 풀기
                                </button>
                            </div>
                        )}
                        {wrong.length===0 ? (
                            <div style={{...S.card,textAlign:"center",color:COLORS.muted,padding:"32px"}}>
                                <p style={{fontSize:"32px",marginBottom:"8px"}}>🎯</p>
                                <p>오답이 없어요! 완벽해요 🎉</p>
                            </div>
                        ) : wrong.map((w,i)=>(
                            <div key={i} style={S.wrongItem}>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"8px"}}>
                                    <div style={{flex:1}}>
                                        <div style={{display:"flex",gap:"6px",marginBottom:"6px",flexWrap:"wrap"}}>
                                            <span style={S.badge(COLORS.red)}>오답</span>
                                            {w.wrongCount>1 && <span style={S.badge(COLORS.yellow)}>{w.wrongCount}회 틀림</span>}
                                        </div>
                                        <p style={{margin:"0 0 6px",fontSize:"14px",fontWeight:"bold",lineHeight:1.4}}>{w.question}</p>
                                        <p style={{margin:0,fontSize:"12px",color:COLORS.green}}>✓ 정답: {w.options[w.answer]}</p>
                                    </div>
                                    <button style={{...S.btnSm,color:COLORS.red,borderColor:"rgba(239,68,68,0.3)",flexShrink:0}} onClick={()=>deleteWrong(w.question)}>삭제</button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* LOADING */}
                {stage===STAGE.LOADING && (
                    <div style={S.loading}>
                        <div style={S.spinner}/>
                        <p>AI가 퀴즈를 만들고 있어요...</p>
                    </div>
                )}

                {/* QUIZ */}
                {stage===STAGE.QUIZ && questions.length>0 && (
                    <>
                        <div style={{marginBottom:"12px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                                <span style={{fontSize:"12px",color:COLORS.muted,fontFamily:"monospace"}}>{reviewMode?"🔁 오답 복습":title||"퀴즈"}</span>
                                <span style={{fontSize:"12px",color:COLORS.muted,fontFamily:"monospace"}}>{current+1} / {questions.length}</span>
                            </div>
                            <div style={S.progressTrack}>
                                <div style={{height:"6px",borderRadius:"3px",background:`linear-gradient(90deg,${COLORS.accent},${COLORS.accent2})`,width:`${((current+1)/questions.length)*100}%`,transition:"width 0.4s ease"}}/>
                            </div>
                        </div>
                        <div style={S.card}>
                            <p style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:COLORS.accent,fontFamily:"monospace",marginBottom:"10px"}}>문제 {current+1}</p>
                            <p style={{fontSize:"17px",fontWeight:"bold",marginBottom:"18px",lineHeight:1.5}}>{questions[current].question}</p>
                            {questions[current].options.map((opt,i)=>{
                                let extra={};
                                if(selected!==null){
                                    if(i===questions[current].answer) extra=S.optionCorrect;
                                    else if(i===selected) extra=S.optionWrong;
                                }
                                return <button key={i} style={{...S.optionBtn,...extra}} onClick={()=>selectOption(i)}>{opt}</button>;
                            })}
                            {selected!==null && <div style={S.explanation}>💡 {questions[current].explanation}</div>}
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <button style={S.btnSm} onClick={goPrev} disabled={current===0}>← 이전</button>
                            <span style={{fontSize:"12px",color:COLORS.muted,fontFamily:"monospace"}}>{answers.filter(a=>a!==null).length}/{questions.length} 완료</span>
                            <button style={{...S.btnSm,borderColor:COLORS.accent,color:COLORS.accent}} onClick={goNext}>
                                {current===questions.length-1?"결과 보기 🎯":"다음 →"}
                            </button>
                        </div>
                    </>
                )}

                {/* RESULT */}
                {stage===STAGE.RESULT && (
                    <div style={{...S.card,textAlign:"center",padding:"32px 24px"}}>
                        <div style={{fontSize:"60px",fontWeight:"bold",background:`linear-gradient(135deg,${COLORS.accent},${COLORS.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1,marginBottom:"6px"}}>
                            {correctCount}/{questions.length}
                        </div>
                        <p style={{fontSize:"20px",fontWeight:"bold",margin:"6px 0 4px"}}>
                            {correctCount===questions.length?"🎉 완벽해요!":correctCount>=questions.length/2?"👍 잘 했어요!":"📚 다시 공부해봐요!"}
                        </p>
                        <p style={{color:COLORS.muted,marginBottom:"10px"}}>정답률 {Math.round((correctCount/questions.length)*100)}%</p>
                        {questions.length-correctCount>0 && (
                            <p style={{fontSize:"13px",color:COLORS.red,marginBottom:"20px"}}>❌ 틀린 문제 {questions.length-correctCount}개 → 오답노트에 자동 저장됐어요</p>
                        )}
                        <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}}>
                            <button style={S.btn} onClick={()=>{setCurrent(0);setSelected(answers[0]);setStage(STAGE.QUIZ);}}>다시 풀기</button>
                            <button style={{...S.btnSm,borderColor:COLORS.purple,color:COLORS.purple}} onClick={saveQuiz}>💾 저장하기</button>
                            <button style={S.btnSm} onClick={reset}>새 퀴즈</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}