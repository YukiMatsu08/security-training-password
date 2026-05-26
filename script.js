// ==========================================================================
// 1. 講義データの定義（1ページ1画像 ＋ 解説文）
// ==========================================================================
const chapterData = {
  1: {
    title: "第1章：なぜ使い回しは危険？",
    image: "assets/img1.png",
    description: "1つのパスワードを複数のサービスで使い回していると、どこか1箇所から情報が漏洩した際に、社内システムまで一網打尽に不正アクセスされる危険（リスト型攻撃）があります。\n\n「他で漏れても会社のは大丈夫」は通用しません。必ず個別のパスワードを設定しましょう。"
  },
  2: {
    title: "第2章：オフィスに潜む罠（付箋・メモ）",
    image: "assets/img2.png",
    description: "忘れないようにと、パソコンのディスプレイやキーボードの裏にパスワードを書いた付箋を貼るのは絶対にNGです！\n\n来客や清掃員、部外者の目に触れるリスクがあります。また、誰でもアクセスできる共有フォルダにテキストファイルでメモしておくのも同様に危険です。"
  },
  3: {
    title: "第3章：推測されやすい危険なパスワード",
    image: "assets/img3.png",
    description: "「password」「123456」といった単純な文字列や、自分の誕生日、名前、ペットの名前などは、攻撃ツールを使えば数秒で破られてしまいます。\n\n英大文字・小文字・数字・記号を混在させ、最低でも12文字以上の「推測されにくいフレーズ」を作りましょう。"
  },
  4: {
    title: "第4章：正しい管理方法",
    image: "assets/img4.png",
    description: "複雑なパスワードをすべて頭の中で覚えるのは不可能です。\n\n安全に管理するために、会社が推奨するパスワード管理ツール（ブラウザの安全な保存機能や専用マネージャー）を正しく活用しましょう。マスターパスワード1つだけを厳重に管理すれば、各サイトの複雑なパスワードを安全に運用できます。"
  },
  5: {
    title: "第5章：最後の砦「多要素認証」",
    image: "assets/img5.png",
    description: "万が一、IDとパスワードが他人に知られてしまっても、アカウントを守る最後の砦が「多要素認証（MFA）」です。\n\nログイン時に自分のスマートフォンに届く通知や、1回限りの認証コード（SMSやアプリ）の入力を必須にすることで、第三者による不正アクセスを完全にブロックします。設定は必ず有効にしてください。"
  }
};

// ==========================================================================
// 2. クイズ問題データの定義
// ==========================================================================
const quizData = [
  {
    question: "Q1. パスワードを設定・管理する際、セキュリティ上「最も不適切」な行動はどれ？",
    choices: [
      "推測されにくいよう、英数字と記号を混ぜて12文字以上にする。",
      "忘れないように、社内の誰もがアクセスできる共有フォルダのテキストファイルにメモしておく。",
      "業務システムごとにすべて異なるパスワードを設定する。"
    ],
    answer: 1,
    explanation: "付箋に書くのはもちろん、共有フォルダにテキストファイルで保存するのもNGです！誰に見られるか分からず非常に危険です。"
  },
  {
    question: "Q2. 複数のウェブサービスで同じパスワードを使い回すことで、発生する最も大きなリスクは何？",
    choices: [
      "パスワードを忘れてしまいやすくなるリスク",
      "他の個人サービスからパスワードが漏洩した際、社内システムまで一網打尽に不正ログインされるリスク",
      "パソコンの動作が全体的に重くなってしまうリスク"
    ],
    answer: 1,
    explanation: "これが「リスト型攻撃」の恐怖です。1箇所が破られると、同じID・パスワード充てているすべてのサービスにログインされてしまいます。"
  },
  {
    question: "Q3. 万が一、パスワードが他人に知られてしまった場合でも、不正アクセスを防ぐ最後の砦となる仕組みはどれ？",
    choices: [
      "多要素認証（MFA）",
      "プログレスバー",
      "ローカルストレージ（LocalStorage）"
    ],
    answer: 0,
    explanation: "IDとパスワードに加え、自分のスマホへの通知など「もう1つの要素」を必要とする多要素認証は、アカウントを守る非常に強力な防壁になります。"
  }
];

// ==========================================================================
// 3. 学習・クイズのステータス管理（初期値）
// ==========================================================================
let userProgress = {
  1: { count: 0, time: 0 },
  2: { count: 0, time: 0 },
  3: { count: 0, time: 0 },
  4: { count: 0, time: 0 },
  5: { count: 0, time: 0 }
};

let correctCount = 0;
let currentChapter = null;
let studyTimer = null;
let currentUserName = "";
let quizStatus = "未受験"; // 未受験, 合格, 不合格

// ==========================================================================
// 4. HTML要素の取得
// ==========================================================================
const screenStart = document.getElementById('screen-start');
const screenMenu  = document.getElementById('screen-menu');
const screenStudy = document.getElementById('screen-study');
const screenQuiz  = document.getElementById('screen-quiz');

const inputUserName     = document.getElementById('user-name');
const btnStart          = document.getElementById('btn-start');
const displayUserName   = document.getElementById('display-user-name');

const studyChapterTitle = document.getElementById('study-chapter-title');
const studyImage        = document.getElementById('study-image');
const studyDescription  = document.getElementById('study-description');
const btnBackToMenu      = document.getElementById('btn-back-to-menu');
const btnCompleteChapter = document.getElementById('btn-complete-chapter');

// クイズ画面の要素
const quizResultSummary  = document.getElementById('quiz-result-summary');
const correctCountDisplay = document.getElementById('correct-count-display');
const resultMessage      = document.getElementById('result-message');
const btnFinishQuiz      = document.getElementById('btn-finish-quiz');
const btnGotoQuiz        = document.getElementById('btn-goto-quiz');
const quizStatusBadge    = document.getElementById('quiz-status-badge');

// ==========================================================================
// 5. アプリ起動時のデータ読み込み（LocalStorageからの復元）
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  // ① 名前の復元
  const savedName = localStorage.getItem('security_user_name');
  // ② 進捗データの復元
  const savedProgress = localStorage.getItem('security_user_progress');
  // ③ クイズステータスの復元
  const savedQuizStatus = localStorage.getItem('security_quiz_status');

  if (savedProgress) {
    userProgress = JSON.parse(savedProgress);
  }
  if (savedQuizStatus) {
    quizStatus = savedQuizStatus;
  }

  // もし過去に名前を入力して受講中なら、スタート画面をスキップして直接メニューへ
  if (savedName) {
    currentUserName = savedName;
    displayUserName.textContent = currentUserName;
    screenStart.style.display = 'none';
    screenMenu.style.display  = 'block';
    updateMenuTable();
    updateQuizBadgeUI();
  }
});

// ==========================================================================
// 6. イベント処理・ロジック
// ==========================================================================

// ① スタートボタン
btnStart.addEventListener('click', function() {
  const userName = inputUserName.value.trim();
  if (userName === "") {
    alert("受講を始めるには、お名前を入力してください。");
    return;
  }
  currentUserName = userName;
  displayUserName.textContent = currentUserName;
  
  // LocalStorageに名前を保存
  localStorage.setItem('security_user_name', currentUserName);
  saveProgressToStorage();

  screenStart.style.display = 'none';
  screenMenu.style.display  = 'block';
  updateMenuTable();
  updateQuizBadgeUI();
});

// ② メニューの「講義ボタン」クリック
document.querySelector('.menu-table').addEventListener('click', function(e) {
  const btn = e.target.closest('.menu-table-btn');
  if (!btn) return; 

  if (btn.id === 'btn-goto-quiz') return;

  const tr = btn.closest('tr');
  const chapter = tr.getAttribute('data-chapter');

  if (chapter) {
    startStudy(Number(chapter));
  }
});

// ③ 講義画面から戻る
btnBackToMenu.addEventListener('click', stopStudy);
btnCompleteChapter.addEventListener('click', stopStudy);

// ④ メニューから「クイズ」ボタンを押したとき
btnGotoQuiz.addEventListener('click', startQuiz);

// ⑤ クイズの「結果を確定してメニューに戻る」ボタン
btnFinishQuiz.addEventListener('click', finishQuizAndReturn);


// ==========================================================================
// 7. コントロール関数
// ==========================================================================

// --- 講義の制御 ---
function startStudy(chapterId) {
  currentChapter = chapterId;
  const data = chapterData[chapterId];
  studyChapterTitle.textContent = data.title;
  studyImage.src = data.image;
  studyDescription.textContent = data.description;
  userProgress[chapterId].count += 1;
  saveProgressToStorage(); // 回数を保存

  screenMenu.style.display  = 'none';
  screenStudy.style.display = 'block';

  studyTimer = setInterval(function() {
    userProgress[chapterId].time += 1;
    // 10秒ごとに裏で自動保存（予期せぬクローズ対策）
    if (userProgress[chapterId].time % 10 === 0) {
      saveProgressToStorage();
    }
  }, 1000);
}

function stopStudy() {
  clearInterval(studyTimer);
  studyTimer = null;
  currentChapter = null;
  saveProgressToStorage(); // 最終時間を保存
  updateMenuTable();
  screenStudy.style.display = 'none';
  screenMenu.style.display  = 'block';
}

function updateMenuTable() {
  for (let id in userProgress) {
    const tr = document.querySelector(`tr[data-chapter="${id}"]`);
    if (tr) {
      tr.querySelector('.count').textContent = userProgress[id].count;
      const totalSeconds = userProgress[id].time;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      tr.querySelector('.time').textContent = `${minutes}分${String(seconds).padStart(2, '0')}秒`;
    }
  }
}

// --- クイズの制御 ---
function startQuiz() {
  quizResultSummary.style.display = 'none';
  buildQuizList();
  screenMenu.style.display = 'none';
  screenQuiz.style.display = 'block';
  window.scrollTo(0, 0);
}

function buildQuizList() {
  const quizFullList = document.getElementById('quiz-full-list');
  quizFullList.innerHTML = ''; 

  quizData.forEach((quiz, qIndex) => {
    const quizItem = document.createElement('div');
    quizItem.className = 'quiz-item';
    
    const questionPara = document.createElement('p');
    questionPara.className = 'quiz-question-text';
    questionPara.textContent = quiz.question;
    quizItem.appendChild(questionPara);

    const choicesContainer = document.createElement('div');
    choicesContainer.className = 'quiz-choices-container';

    quiz.choices.forEach((choice, cIndex) => {
      const label = document.createElement('label');
      label.className = 'choice-label';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `question-${qIndex}`; 
      radio.value = cIndex;

      label.appendChild(radio);
      label.appendChild(document.createTextNode(choice));
      choicesContainer.appendChild(label);
    });

    quizItem.appendChild(choicesContainer);
    
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = `feedback-box-${qIndex}`;
    quizItem.appendChild(feedbackDiv);

    quizFullList.appendChild(quizItem);
  });

  const submitBox = document.createElement('div');
  submitBox.className = 'submit-box';
  submitBox.id = 'submit-btn-box';
  
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn';
  submitBtn.textContent = '解答を送信して採点する';
  submitBtn.addEventListener('click', gradeQuiz); 
  
  submitBox.appendChild(submitBtn);
  quizFullList.appendChild(submitBox);
}

function gradeQuiz() {
  correctCount = 0;
  let allAnswered = true;

  quizData.forEach((quiz, qIndex) => {
    const selected = document.querySelector(`input[name="question-${qIndex}"]:checked`);
    if (!selected) {
      allAnswered = false;
    }
  });

  if (!allAnswered) {
    alert("まだ解答していない問題があります。すべての問題に答えてください。");
    return;
  }

  quizData.forEach((quiz, qIndex) => {
    const selected = document.querySelector(`input[name="question-${qIndex}"]:checked`);
    const answerIndex = Number(selected.value);
    const feedbackDiv = document.getElementById(`feedback-box-${qIndex}`);
    
    feedbackDiv.innerHTML = ''; 
    feedbackDiv.className = 'item-feedback';

    if (answerIndex === quiz.answer) {
      correctCount++;
      feedbackDiv.classList.add('feedback-correct');
      feedbackDiv.innerHTML = `⭕ 正解！ <span class="feedback-commentary">${quiz.explanation}</span>`;
    } else {
      feedbackDiv.classList.add('feedback-incorrect');
      feedbackDiv.innerHTML = `❌ 不正解...（正解は${quiz.answer + 1}番目） <span class="feedback-commentary">${quiz.explanation}</span>`;
    }
  });

  const submitBtnBox = document.getElementById('submit-btn-box');
  if (submitBtnBox) submitBtnBox.style.display = 'none';

  const allRadios = document.querySelectorAll('input[type="radio"]');
  allRadios.forEach(radio => radio.disabled = true);

  correctCountDisplay.textContent = correctCount;
  
  if (correctCount === quizData.length) {
    resultMessage.textContent = "素晴らしい！全問正解です。情報セキュリティの基本がバッチリ身についています！";
    resultMessage.style.color = "#22543d";
    quizStatus = "合格";
  } else {
    resultMessage.textContent = "残念、満点ではありませんでした。各問題の解説を読み直し、もう一度メニューから挑戦してください。";
    resultMessage.style.color = "#742a2a";
    quizStatus = "不合格";
  }

  // クイズ結果をLocalStorageに保存
  localStorage.setItem('security_quiz_status', quizStatus);

  quizResultSummary.style.display = 'block';
  quizResultSummary.scrollIntoView({ behavior: 'smooth' });
}

function finishQuizAndReturn() {
  updateQuizBadgeUI();
  screenQuiz.style.display = 'none';
  screenMenu.style.display = 'block';
  window.scrollTo(0, 0);
}

// --- データ保存とUI更新のヘルパー関数 ---

// 連想配列(オブジェクト)を文字列に変換してLocalStorageに保存する
function saveProgressToStorage() {
  localStorage.setItem('security_user_progress', JSON.stringify(userProgress));
}

// クイズの合否バッジの見た目を現在のステータスに合わせて更新する
function updateQuizBadgeUI() {
  quizStatusBadge.className = 'badge';
  quizStatusBadge.textContent = quizStatus;

  if (quizStatus === '合格') {
    quizStatusBadge.classList.add('status-pass');
  } else if (quizStatus === '不合格') {
    quizStatusBadge.classList.add('status-fail');
  } else {
    quizStatusBadge.classList.add('status-unvisited');
  }
}