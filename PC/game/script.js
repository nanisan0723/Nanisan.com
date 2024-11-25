const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const images = ['red.png', 'green.png', 'blue.png'];
const gridSize = 3; // 3x3 グリッド
let score = 0;
let timeRemaining = 30; // 制限時間30秒
let gameActive = true;
const deleteSound = new Audio('delete.wav'); // 音声ファイルのロード

// 初期グリッドを生成
function createGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const img = document.createElement('img');
        img.src = images[Math.floor(Math.random() * images.length)];
        img.dataset.index = i;
        img.addEventListener('click', () => handleClick(i));
        grid.appendChild(img);
    }
}

// クリック処理：画像を消し、下に落とし、新しい画像を生成
function handleClick(index) {
    if (!gameActive) return;

    const currentImage = grid.children[index];
    if (!currentImage || currentImage.classList.contains('hidden')) return;

    const currentSrc = currentImage.src;
    currentImage.classList.add('hidden'); // 現在の画像を消す
    score += 1000;
    updateScore();

    // 音を再生（画像を消したとき）
    deleteSound.play();

    // 周囲の同じ画像を再帰的に消す
    const neighbors = [
        index - gridSize, // 上
        index + gridSize, // 下
        index - 1, // 左
        index + 1, // 右
    ];

    neighbors.forEach((neighborIndex) => {
        const neighbor = grid.children[neighborIndex];
        if (
            neighbor &&
            neighbor.src === currentSrc &&
            !neighbor.classList.contains('hidden') &&
            isValidNeighbor(index, neighborIndex)
        ) {
            handleClick(neighborIndex);
        }
    });

    // 全て落としてから新しい画像を生成
    setTimeout(() => {
        dropImages(() => {
            generateNewImages();
        });
    }, 300);
}

// グリッド内の画像を下に落とす
function dropImages(callback) {
    for (let col = 0; col < gridSize; col++) {
        const column = [];

        // 各列の画像を収集（上から下）
        for (let row = 0; row < gridSize; row++) {
            const index = row * gridSize + col;
            const img = grid.children[index];
            if (!img.classList.contains('hidden')) {
                column.push(img.src); // 消されていない画像を収集
            }
        }

        // 列を下から埋める
        for (let row = gridSize - 1; row >= 0; row--) {
            const index = row * gridSize + col;
            const img = grid.children[index];
            if (gridSize - 1 - row < column.length) {
                img.src = column[column.length - 1 - (gridSize - 1 - row)];
                img.classList.remove('hidden');
            } else {
                img.src = ''; // 空白を設定
                img.classList.add('hidden');
            }
        }
    }

    // 落下アニメーションの完了後にコールバックを実行
    setTimeout(() => {
        if (callback) callback();
    }, 300);
}

// 新しい画像を生成（空白のみに）
function generateNewImages() {
    for (let col = 0; col < gridSize; col++) {
        for (let row = 0; row < gridSize; row++) {
            const index = row * gridSize + col;
            const img = grid.children[index];
            if (img.classList.contains('hidden')) {
                const newImage = images[Math.floor(Math.random() * images.length)];
                img.src = newImage;
                img.classList.remove('hidden');

                // 新しい画像にアニメーションを追加
                img.style.transition = 'transform 0.5s ease-in';
                img.style.transform = 'translateY(-100px)';
                setTimeout(() => {
                    img.style.transform = 'translateY(0)';
                }, 50);
            }
        }
    }
}

// 隣接が有効かを確認（端同士の誤判定を防ぐ）
function isValidNeighbor(currentIndex, neighborIndex) {
    if (currentIndex % gridSize === 0 && neighborIndex % gridSize === gridSize - 1) return false;
    if (currentIndex % gridSize === gridSize - 1 && neighborIndex % gridSize === 0) return false;
    return true;
}

// スコアを更新
function updateScore() {
    scoreDisplay.textContent = `スコア: ${score}`;
}

// タイマーを開始
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            gameActive = false;
            alert(`ゲーム終了！最終スコア: ${score}`);
        } else {
            timeRemaining--;
            timerDisplay.textContent = `残り時間: ${timeRemaining}秒`;
        }
    }, 1000);
}

// 初期化
createGrid();
startTimer();
