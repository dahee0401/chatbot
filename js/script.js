// 페이지가 로드될 때 챗봇의 초기 메시지 추가
window.onload = function () {
    const chatContainer = document.querySelector('.chat-container');
    const boardOpenButton = document.querySelector('.board-open');
    const closeButton = document.querySelector('.close-btn');

    const initialMessage = '고객님 상담직원 000입니다. 상담 중 도와드릴 내용이 있을까요?';
    addMessage(initialMessage, 'bot-message');

    // 보드 열기 버튼 클릭 시 chat-container 보이기/숨기기 (토글)
    boardOpenButton.addEventListener('click', function () {
        if (chatContainer.classList.contains('show')) {
            chatContainer.classList.remove('show'); // 숨기기
            boardOpenButton.classList.remove('open'); // 버튼 상태 변경
        } else {
            chatContainer.classList.add('show'); // 보이기
            boardOpenButton.classList.add('open'); // 버튼 상태 변경
        }
    });

    // 닫기 버튼 클릭 시 chat-container 숨기기
    closeButton.addEventListener('click', function () {
        chatContainer.classList.remove('show'); // 숨기기
        boardOpenButton.classList.remove('open'); // 버튼 상태 변경
    });
};

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            // Shift + Enter일 경우 줄바꿈
            event.preventDefault(); // 기본 동작 방지
            const input = document.getElementById('user-input');
            const start = input.selectionStart;
            const end = input.selectionEnd;

            // 입력 중간에 줄바꿈 추가
            input.value = input.value.substring(0, start) + '\n' + input.value.substring(end);
            input.selectionStart = input.selectionEnd = start + 1; // 커서 위치 조정
        } else {
            // 그냥 Enter일 경우 메시지 전송
            event.preventDefault();
            sendMessage();
        }
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();

    if (userMessage) {
        // 사용자 메시지 추가
        addMessage(userMessage, 'user-message');
        userInput.value = '';

        // 로딩 메시지 추가 (텍스트 없이)
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message bot-message loading';

        // 로딩 아이콘을 위한 span 3개 생성
        for (let i = 0; i < 3; i++) {
            const loadingBall = document.createElement('span'); // 로딩 아이콘을 위한 span
            loadingBall.className = 'loading-ball'; // 같은 클래스 적용
            loadingMessage.appendChild(loadingBall);
        }

        document.getElementById('chat-box').appendChild(loadingMessage);
        document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight; // 자동 스크롤

        // 간단한 챗봇 응답
        setTimeout(() => {
            loadingMessage.remove();
            // 챗봇 응답 추가
            const botResponse = getBotResponse(userMessage);
            if (botResponse) {
                addMessage(botResponse, 'bot-message');
            }
        }, 1000);
    }
}

// 현재시각 구하기
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function addMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    // 채팅 말풍선 추가
    const messageElement = document.createElement('div');
    messageElement.className = 'message ' + className;

    // 역할을 나타내는 span 추가
    const roleElement = document.createElement('span');
    roleElement.className = 'message-role';
    roleElement.textContent = className === 'user-message' ? '사용자' : '챗봇';
    messageElement.appendChild(roleElement);

    // 메시지 텍스트 추가
    const textElement = document.createElement('div');
    textElement.className = 'message-text';
    textElement.innerHTML = message; // HTML을 사용하여 스타일 적용
    messageElement.appendChild(textElement);

    // 현재 시각 추가
    const timeElement = document.createElement('span');
    timeElement.className = 'message-time';
    timeElement.textContent = getCurrentTime();
    messageElement.appendChild(timeElement);

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // 자동 스크롤

    return messageElement;
}

function getBotResponse(input) {
    // 1. 입력 처리
    const userInput = input.trim().toLowerCase(); // 공백 제거 및 소문자로 변환

    // 2. 사전 정의된 응답
    const responses = {
        안녕: '안녕하세요!',
        '잘 지내?': '네, 당신은요?',
        고마워: '천만에요!',
        '무슨 일이야?': '저는 당신을 도와줄 준비가 되어 있습니다.',
        '안녕히 가세요': '안녕히 가세요! 다시 만나요!',
        '도움이 필요해': '어떤 도움이 필요하신가요?',
        '상담이 필요해': '무엇에 대해 상담하고 싶으신가요?',
    };

    // 3. 금지어 목록
    const forbiddenWords = [
        '개새끼',
        '미친놈',
        '병신',
        '썅년',
        '시발',
        '엿',
        '새끼',
        '더러운',
        '바보',
        '멍청이',
        '찌질이',
        '쓰레기',
        '얼간이',
        '무식한',
        '노예',
        '미친년',
        '정신병자',
        '찌질한',
        '개자식',
        '시궁창',
        '똥개',
        '죽어라',
        '꺼져',
        '싫어',
        '나가라',
        'ㅅㅂ',
        'ㅈㄴ',
        'ㅅㅅ',
    ];

    // 4. 금지어 확인
    for (const word of forbiddenWords) {
        if (userInput.includes(word)) {
            // 금지어가 포함된 경우 사용자 메시지를 빨간색으로 표시
            return `<span style="color: #ff0000;">금칙어를 사용하였습니다.</span>`;
        }
    }

    // 5. 키워드 매칭
    for (const keyword in responses) {
        if (userInput.includes(keyword)) {
            return responses[keyword]; // 키워드가 포함된 경우 해당 응답 반환
        }
    }

    // 6. 조건부 응답
    if (userInput.includes('기분') || userInput.includes('어떻게')) {
        return '저는 항상 좋습니다! 당신은요?';
    }

    // 7. 정서 분석 (옵션)
    if (userInput.includes('슬퍼') || userInput.includes('힘들어')) {
        return '힘든 일이 있으신가요? 제가 도와드릴 수 있는 부분이 있을까요?';
    }

    // 8. 기본 응답
    return '죄송하지만, 이해하지 못했습니다. 더 구체적으로 말씀해 주실 수 있나요?';
}
