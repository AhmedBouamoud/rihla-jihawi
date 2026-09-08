const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const html=readFileSync(path.join(__dirname,'../index.html'),'utf8');
let source=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1];
source=source.slice(0,source.lastIndexOf('\nrenderAll();'));
function createContext(blockStorage=false){
  const data=new Map(), elements=new Map(), timers=[];
  const element=id=>{
    if(!elements.has(id)) elements.set(id,{innerHTML:'',textContent:'',value:'',style:{},dataset:{},
      classList:{add(){},remove(){},contains(){return false},toggle(){}},
      querySelector:()=>element(id+'child'),querySelectorAll:()=>[],appendChild(){},setAttribute(){},addEventListener(){},focus(){}});
    return elements.get(id);
  };
  const storage={getItem:k=>{if(blockStorage)throw Error('denied');return data.get(k)||null;},setItem:(k,v)=>{if(blockStorage)throw Error('denied');data.set(k,v);}};
  const context=vm.createContext({console,localStorage:storage,sessionStorage:storage,
    document:{getElementById:element,querySelectorAll:()=>[],addEventListener(){},createElement:()=>element(Math.random()),body:element('body')},
    window:{addEventListener(){},print(){}},setTimeout:(fn,ms)=>{timers.push({fn,ms});},clearTimeout(){}});
  vm.runInContext(source,context);
  vm.runInContext('renderAll=()=>{};playTone=()=>{};confetti=()=>{};checkMilestones=()=>{};',context);
  return {run:s=>vm.runInContext(s,context),element,timers,data};
}
const c=createContext();
assert.equal(c.run('validQuestionBank(DEFAULT_STATIONS)'),true);
assert.equal(c.run("validQuestionBank(DEFAULT_STATIONS.map((s,i)=>i===0?{...s,id:2}:s))"),false);
assert.equal(c.run("validQuestionBank(DEFAULT_STATIONS.map((s,i)=>i===0?{...s,title:'<img onerror=alert(1)>'}:s))"),false);
assert.equal(c.run("validQuestionBank(DEFAULT_STATIONS.map((s,i)=>i===0?{...s,questions:[{...s.questions[0],correct:9},...s.questions.slice(1)]}:s))"),false);
c.run("safeWrite(PROGRESS_KEY,JSON.stringify({name:12,completed:{1:2,2:99,3:'3',999:3},rewards:{},bestStars:999}));progress=loadProgress();");
assert.equal(c.run('Object.keys(progress.completed).join()'),'1');
assert.equal(c.run('progress.completed[1]'),2);
assert.equal(c.run('progress.bestStars'),2);
assert.equal(c.run('progress.name'),'');
// A rapid second press must not skip the next question.
c.run('openStation(1);showQuizStage();selectedOption=currentStation.questions[0].correct;commitAnswer();afterFeedback();afterFeedback();');
assert.equal(c.timers.filter(t=>t.ms===300).length,1);
c.timers.find(t=>t.ms===300).fn();
assert.equal(c.run('currentQuestionIndex'),1);
// A queued callback from a closed lesson must not advance another lesson.
c.run('selectedOption=0;commitAnswer();afterFeedback();closeStationScreen();openStation(2);');
c.timers.filter(t=>t.ms===300).at(-1).fn();
assert.equal(c.run('currentQuestionIndex'),0);
// Replays retain the highest score and report only newly earned XP.
c.run('progress.completed[1]=2;openStation(1);currentScore=1;showCelebration();');
assert.equal(c.run('progress.completed[1]'),2);
assert.equal(c.element('celXP').textContent,'+0');
c.run('openStation(1);currentScore=3;showCelebration();');
assert.equal(c.element('celXP').textContent,'+20');
// The history challenge samples exactly two questions from each of six lessons.
c.run('for(let i=1;i<=6;i++)progress.completed[i]=3;openFinalChallenge();');
assert.equal(c.run('currentStation.questions.length'),12);
assert.equal(c.run('JSON.stringify([1,2,3,4,5,6].map(id=>currentStation.questions.filter(q=>q.stationId===id).length))'),'[2,2,2,2,2,2]');
const before=c.run('JSON.stringify(progress)');
c.run('currentScore=12;answerHistory=currentStation.questions.map(q=>({correct:true,stationId:q.stationId}));showCelebration();');
assert.equal(c.run('JSON.stringify(progress)'),before);
assert.match(c.element('stageQuiz').innerHTML,/12 \/ 12/);
// A wrong answer is not painted as a successful previous answer.
c.run('openStation(1);answerHistory=[{correct:false}];currentQuestionIndex=1;renderCurrentQuestion();');
assert.match(c.element('stageQuiz').innerHTML,/qdot missed/);
c.run('printHistorySummary();');
assert.equal((c.element('lessonPrintArea').innerHTML.match(/<article>/g)||[]).length,6);
c.run('printHistorySummary(3);');
assert.equal((c.element('lessonPrintArea').innerHTML.match(/<article>/g)||[]).length,1);
// Private/restricted storage must not prevent app initialization or the quiz.
const restricted=createContext(true);
assert.equal(restricted.run('stations.length'),22);
assert.equal(restricted.run('saveProgress()'),false);
restricted.run('openStation(1);showQuizStage();');
console.log('PASS: import validation, corrupt progress, rapid navigation, stale callbacks, replay XP, 12-question challenge, result dots, summary output, blocked storage.');
