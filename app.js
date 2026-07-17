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

const theory={
 "Present Simple":{formula:"V / V-s",use:"Регулярные действия, привычки и факты.",markers:"every day, usually, often, always",example:"She works at the office every Monday."},
 "Present Continuous":{formula:"am / is / are + V-ing",use:"Действие происходит прямо сейчас или временно.",markers:"now, right now, at the moment, Look!",example:"They are playing tennis right now."},
 "Past Simple":{formula:"V-ed / вторая форма",use:"Завершённое действие в конкретный момент прошлого.",markers:"yesterday, last week, ago, in 2020",example:"I watched this series yesterday."},
 "Future Simple":{formula:"will + V",use:"Решение, обещание или предположение о будущем.",markers:"tomorrow, next week, I think, probably",example:"She will call a friend tomorrow."},
 "Past Continuous":{formula:"was / were + V-ing",use:"Процесс, который шёл в определённый момент прошлого.",markers:"at 7 p.m. yesterday, while, when",example:"They were cooking dinner at 7 p.m. yesterday."},
 "Future Continuous":{formula:"will be + V-ing",use:"Процесс, который будет идти в определённый момент будущего.",markers:"at this time tomorrow, at 7 p.m. tomorrow",example:"I will be studying English at 7 p.m. tomorrow."},
 "Present Perfect":{formula:"have / has + V3",use:"Есть результат к настоящему моменту; точное время неважно.",markers:"already, just, yet, ever, never",example:"She has already cleaned the room."},
 "Past Perfect":{formula:"had + V3",use:"Действие завершилось раньше другого события в прошлом.",markers:"before, after, by the time",example:"They had opened the shop before the meeting started."},
 "Present Perfect Continuous":{formula:"have / has been + V-ing",use:"Процесс начался раньше и всё ещё продолжается.",markers:"for, since, all day",example:"I have been studying English for two hours."},
 "Past Perfect Continuous":{formula:"had been + V-ing",use:"Процесс длился некоторое время до момента в прошлом.",markers:"for, since, before",example:"She had been working for two hours before the meeting started."},
 "Future Perfect":{formula:"will have + V3",use:"Действие завершится к определённому моменту будущего.",markers:"by, by the time, before",example:"They will have cooked dinner by 7 p.m. tomorrow."},
 "Future Perfect Continuous":{formula:"will have been + V-ing",use:"К моменту в будущем процесс будет длиться указанное время.",markers:"for ... by, by the time",example:"I will have been working for two hours by 7 p.m. tomorrow."}
};

const STORAGE_KEY="glagolt-progress-v2";
const defaultProgress={answered:0,correct:0,bestStreak:0,mistakes:[]};
let saved=loadProgress();
let theoryLevel="easy";
let bank=makeBank();
let round=[],at=0,hits=0,streak=0,lastMode="easy",mistakeMode=false,locked=false;

const $=id=>document.getElementById(id);
const screens={home:$("home-screen"),theory:$("theory-screen"),question:$("question-screen"),result:$("result-screen")};

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

function openTheory(level){
 theoryLevel=level;
 const labels={easy:"Лёгкий уровень",medium:"Средний уровень",hard:"Сложный уровень"};
 $("theory-level").textContent=labels[level];
 const available=tenses.filter(t=>allowed(t,level));
 $("theory-list").innerHTML=available.map((t,index)=>{
   const item=theory[t.name];
   return `<details class="theory-card"${index===0?" open":""}>
     <summary>${t.name}</summary>
     <div class="theory-body">
       <p><span class="formula">${item.formula}</span></p>
       <p><strong>Когда:</strong> ${item.use}</p>
       <p class="markers"><strong>Маркеры:</strong> ${item.markers}</p>
       <p class="example"><strong>Пример:</strong> ${item.example}</p>
     </div>
   </details>`;
 }).join("");
 show("theory");
 window.scrollTo({top:0,behavior:"smooth"});
}

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

document.querySelectorAll("[data-level]").forEach(button=>button.addEventListener("click",()=>openTheory(button.dataset.level)));
$("theory-home-button").addEventListener("click",()=>show("home"));
$("start-theory-button").addEventListener("click",()=>start(theoryLevel));
$("mistakes-button").addEventListener("click",()=>start("hard",true));
$("next-button").addEventListener("click",next);
$("home-button").addEventListener("click",()=>{updateHome();show("home");});
$("result-home-button").addEventListener("click",()=>{updateHome();show("home");});
$("again-button").addEventListener("click",()=>start(lastMode,mistakeMode));
updateHome();
