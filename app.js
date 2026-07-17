const subjects=[
 {key:"i",label:"I",be:"am",pastBe:"was",have:"have"},
 {key:"she",label:"She",be:"is",pastBe:"was",have:"has"},
 {key:"they",label:"They",be:"are",pastBe:"were",have:"have"}
];

const verbs=[
 ["work","working","worked","at the office"],
 ["play","playing","played","tennis"],
 ["study","studying","studied","English"],
 ["watch","watching","watched","this series"],
 ["visit","visiting","visited","the museum"],
 ["clean","cleaning","cleaned","the room"],
 ["open","opening","opened","the shop"],
 ["call","calling","called","a friend"],
 ["help","helping","helped","the neighbours"],
 ["cook","cooking","cooked","dinner"],
 ["walk","walking","walked","in the park"],
 ["travel","travelling","travelled","around Europe"]
].map(([base,ing,past,tail])=>({base,ing,past,tail}));

const tenses=[
 {name:"Present Simple",group:"easy",marker:"every Monday",hint:"регулярное действие",form:(s,v)=>s.key==="she"?v.base+"s":v.base,explain:"Present Simple описывает регулярные действия. С he/she/it к глаголу добавляется -s."},
 {name:"Present Continuous",group:"easy",marker:"right now",hint:"действие происходит прямо сейчас",form:(s,v)=>s.be+" "+v.ing,explain:"Present Continuous: am/is/are + глагол с -ing."},
 {name:"Past Simple",group:"easy",marker:"yesterday",hint:"завершённое действие в прошлом",form:(s,v)=>v.past,explain:"Past Simple используется с завершённым временем в прошлом, например yesterday."},
 {name:"Future Simple",group:"easy",marker:"tomorrow",hint:"действие произойдёт в будущем",form:(s,v)=>"will "+v.base,explain:"Future Simple: will + начальная форма глагола."},
 {name:"Past Continuous",group:"medium",marker:"at 7 p.m. yesterday",hint:"процесс в конкретный момент прошлого",form:(s,v)=>s.pastBe+" "+v.ing,explain:"Past Continuous: was/were + глагол с -ing."},
 {name:"Future Continuous",group:"medium",marker:"at 7 p.m. tomorrow",hint:"процесс в конкретный момент будущего",form:(s,v)=>"will be "+v.ing,explain:"Future Continuous: will be + глагол с -ing."},
 {name:"Present Perfect",group:"medium",marker:"already",hint:"есть результат к настоящему моменту",form:(s,v)=>s.have+" "+v.past,explain:"Present Perfect: have/has + третья форма глагола."},
 {name:"Past Perfect",group:"medium",marker:"before the meeting started",hint:"действие завершилось раньше другого события в прошлом",form:(s,v)=>"had "+v.past,explain:"Past Perfect: had + третья форма глагола."},
 {name:"Present Perfect Continuous",group:"hard",marker:"for two hours and is still doing it",hint:"процесс начался раньше и продолжается сейчас",form:(s,v)=>s.have+" been "+v.ing,explain:"Present Perfect Continuous: have/has been + глагол с -ing."},
 {name:"Past Perfect Continuous",group:"hard",marker:"for two hours before the meeting started",hint:"процесс длился до момента в прошлом",form:(s,v)=>"had been "+v.ing,explain:"Past Perfect Continuous: had been + глагол с -ing."},
 {name:"Future Perfect",group:"hard",marker:"by 7 p.m. tomorrow",hint:"действие завершится к моменту в будущем",form:(s,v)=>"will have "+v.past,explain:"Future Perfect: will have + третья форма глагола."},
 {name:"Future Perfect Continuous",group:"hard",marker:"for two hours by 7 p.m. tomorrow",hint:"к моменту в будущем процесс будет длиться указанное время",form:(s,v)=>"will have been "+v.ing,explain:"Future Perfect Continuous: will have been + глагол с -ing."}
];

const STORAGE_KEY="glagolt-progress-v2";
const defaultProgress={answered:0,correct:0,bestStreak:0,mistakes:[]};
let saved=loadProgress();
let bank=makeBank();
let round=[],at=0,hits=0,streak=0,lastMode="easy",mistakeMode=false,locked=false;

const $=id=>document.getElementById(id);
const screens={home:$("home-screen"),question:$("question-screen"),result:$("result-screen")};

function loadProgress(){
 try{return {...defaultProgress,...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")};}
 catch{return {...defaultProgress};}
}
function saveProgress(){localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));updateHome();}
function shuffle(items){return [...items].sort(()=>Math.random()-.5);}
function allForms(s,v){return [...new Set(tenses.map(t=>t.form(s,v)))];}

function makeBank(){
 let id=0,items=[];
 for(const tense of tenses)for(const subject of subjects)for(const verb of verbs){
   const correct=tense.form(subject,verb);
   const wrong=shuffle(allForms(subject,verb).filter(form=>form!==correct)).slice(0,3);
   items.push({
     id:++id,tense:tense.name,group:tense.group,
     text:`${subject.label} ___ ${verb.tail} ${tense.marker}.`,
     hint:tense.hint,correct,options:shuffle([correct,...wrong]),explain:tense.explain
   });
 }
 return items;
}

function allowed(question,level){
 if(level==="hard")return true;
 if(level==="medium")return question.group!=="hard";
 return question.group==="easy";
}

function show(name){Object.entries(screens).forEach(([key,node])=>node.classList.toggle("hidden",key!==name));}

function start(level,errorsOnly=false){
 lastMode=level;mistakeMode=errorsOnly;at=0;hits=0;streak=0;
 const pool=errorsOnly?bank.filter(q=>saved.mistakes.includes(q.id)):bank.filter(q=>allowed(q,level));
 round=shuffle(pool).slice(0,errorsOnly?30:20);
 if(!round.length){show("home");return;}
 show("question");renderQuestion();
}

function renderQuestion(){
 locked=false;
 const q=round[at];
 $("question-counter").textContent=`Вопрос ${at+1} из ${round.length}`;
 $("score").textContent=`Счёт: ${hits}`;
 $("progress-bar").style.width=`${((at+1)/round.length)*100}%`;
 $("tense-label").textContent=mistakeMode?"Работа над ошибками":q.tense;
 $("question-text").textContent=q.text;
 $("question-hint").textContent="Подсказка: "+q.hint;
 $("feedback").className="feedback hidden";
 $("next-button").classList.add("hidden");
 $("answers").innerHTML="";
 q.options.forEach(option=>{
   const button=document.createElement("button");
   button.className="answer-button";button.textContent=option;
   button.addEventListener("click",()=>answer(option,button));
   $("answers").appendChild(button);
 });
}

function answer(choice,chosenButton){
 if(locked)return;locked=true;
 const q=round[at],correct=choice===q.correct;
 const buttons=[...document.querySelectorAll(".answer-button")];
 buttons.forEach(button=>{
   button.disabled=true;
   if(button.textContent===q.correct)button.classList.add("correct");
 });
 if(!correct)chosenButton.classList.add("wrong");
 saved.answered++;
 if(correct){
   saved.correct++;hits++;streak++;
   saved.bestStreak=Math.max(saved.bestStreak,streak);
   saved.mistakes=saved.mistakes.filter(id=>id!==q.id);
 }else{
   streak=0;
   if(!saved.mistakes.includes(q.id))saved.mistakes.push(q.id);
 }
 saveProgress();
 $("score").textContent=`Счёт: ${hits}`;
 const feedback=$("feedback");
 feedback.innerHTML=correct
   ? `<strong>Верно!</strong> ${q.explain}`
   : `<strong>Неверно.</strong> Правильный ответ: <strong>${q.correct}</strong>.<br>${q.explain}`;
 feedback.className="feedback "+(correct?"correct":"wrong");
 $("next-button").textContent=at===round.length-1?"Узнать результат":"Следующий вопрос";
 $("next-button").classList.remove("hidden");
}

function next(){at++;at<round.length?renderQuestion():showResult();}

function showResult(){
 const percent=Math.round(hits/round.length*100);
 $("result-score").textContent=`${hits} / ${round.length}`;
 let title="Продолжай практику!",message="Ошибки сохранены — их можно повторить отдельно.",icon="🌱";
 if(percent>=80){title="Отличный результат!";message="Ты уверенно различаешь времена.";icon="🏆";}
 else if(percent>=50){title="Хорошая работа!";message="Ещё немного практики — и результат станет ещё лучше.";icon="✨";}
 $("result-title").textContent=title;$("result-message").textContent=message;$("result-icon").textContent=icon;
 show("result");
}

function updateHome(){
 $("stat-answered").textContent=saved.answered;
 $("stat-accuracy").textContent=saved.answered?Math.round(saved.correct/saved.answered*100)+"%":"0%";
 $("stat-best").textContent=saved.bestStreak;
 $("mistakes-count").textContent=saved.mistakes.length;
 $("mistakes-button").disabled=saved.mistakes.length===0;
}

document.querySelectorAll("[data-level]").forEach(button=>button.addEventListener("click",()=>start(button.dataset.level)));
$("mistakes-button").addEventListener("click",()=>start("hard",true));
$("next-button").addEventListener("click",next);
$("home-button").addEventListener("click",()=>{updateHome();show("home");});
$("result-home-button").addEventListener("click",()=>{updateHome();show("home");});
$("again-button").addEventListener("click",()=>start(lastMode,mistakeMode));
updateHome();
