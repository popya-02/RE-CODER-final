document.addEventListener('DOMContentLoaded', function () {
    const maxSentiSelections = 3;
    const maxHobbySelections = 5;

    // 성향 체크박스 처리
    const likeCheckboxes = document.querySelectorAll('input[name="likes"]');
    const dislikeCheckboxes = document.querySelectorAll('input[name="dislikes"]');

    likeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (document.querySelectorAll('input[name="likes"]:checked').length > maxSentiSelections) {
                checkbox.checked = false;
                Swal.fire({
                    icon: 'warning',
                    title: '선택 초과',
                    text: `최대 ${maxSentiSelections}개까지 선택할 수 있습니다.`,
                });
            }
        });
    });

    dislikeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (document.querySelectorAll('input[name="dislikes"]:checked').length > maxSentiSelections) {
                checkbox.checked = false;
                Swal.fire({
                    icon: 'warning',
                    title: '선택 초과',
                    text: `최대 ${maxSentiSelections}개까지 선택할 수 있습니다.`,
                });
            }
        });
    });

    // 취미 체크박스 처리
    const hobbyCheckboxes = document.querySelectorAll('input[name="hobbies"]');

    hobbyCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (document.querySelectorAll('input[name="hobbies"]:checked').length > maxHobbySelections) {
                checkbox.checked = false;
                Swal.fire({
                    icon: 'warning',
                    title: '선택 초과',
                    text: `취미는 최대 ${maxHobbySelections}개까지 선택할 수 있습니다.`,
                });
            }
        });
    });

    // 피드 좋아요 하트 아이콘 클릭 처리
    const feedHeartIcons = document.querySelectorAll('.feed-heart');

    feedHeartIcons.forEach(heart => {
        heart.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleFeedLike(this);
        });
    });

    // 프로필 좋아요 하트 아이콘 클릭 처리
    const profHeartIcons = document.querySelectorAll('.prof-heart');

    profHeartIcons.forEach(heart => {
        heart.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleProfileLike(this);
        });
    });

    // 피드 좋아요 토글 함수
    function toggleFeedLike(element) {
        const feedNo = element.closest('.liked-feed-item').getAttribute('data-feed-no');
        const isLiked = element.classList.contains('liked');

        if (isLiked) {
            // 좋아요 해제
            fetch(`/mypage/unlikeFeed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ feedNo: feedNo })
            }).then(response => {
                if (response.ok) {
                    element.classList.remove('liked');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '실패',
                        text: '좋아요 해제에 실패했습니다.',
                    });
                }
            });
        } else {
            // 좋아요 추가
            fetch(`/mypage/likeFeed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ feedNo: feedNo })
            }).then(response => {
                if (response.ok) {
                    element.classList.add('liked');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '실패',
                        text: '좋아요 추가에 실패했습니다.',
                    });
                }
            });
        }
    }

    // 프로필 좋아요 토글 함수
    function toggleProfileLike(element) {
        const likedUserNo = element.closest('.liked-prof-item').getAttribute('data-liked-user-no');
        const isLiked = element.classList.contains('liked');

        if (isLiked) {
            // 프로필 좋아요 해제
            fetch(`/mypage/unlikeProfile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ likedUserNo: likedUserNo })
            }).then(response => {
                if (response.ok) {
                    element.classList.remove('liked');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '실패',
                        text: '프로필 좋아요 해제에 실패했습니다.',
                    });
                }
            });
        } else {
            // 프로필 좋아요 추가
            fetch(`/mypage/likeProfile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ likedUserNo: likedUserNo })
            }).then(response => {
                if (response.ok) {
                    element.classList.add('liked');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '실패',
                        text: '프로필 좋아요 추가에 실패했습니다.',
                    });
                }
            });
        }
    }

    // 팝업 관련 기능
    const openPopupButton = document.querySelector('.btn-edit-trigger');
    const popup = document.getElementById('passwordPopup');
    const closePopupButton = document.getElementById('closePopup');
    const submitPasswordButton = document.getElementById('submitPassword');
    const passwordInput = document.getElementById('passwordInput');

    if (openPopupButton && popup && closePopupButton && submitPasswordButton && passwordInput) {
        openPopupButton.addEventListener('click', function () {
            popup.style.display = 'flex';
            passwordInput.focus();
        });

        closePopupButton.addEventListener('click', function () {
            popup.style.display = 'none';
        });

        submitPasswordButton.addEventListener('click', function () {
            const password = passwordInput.value;
            if (password) {
                fetch('/mypage/validatePassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password: password })
                }).then(response => response.json())
                  .then(data => {
                      if (data.valid) {
                          window.location.href = '/mypage/infoedit';
                      } else {
                          Swal.fire({
                              icon: 'error',
                              title: '오류',
                              text: '비밀번호가 일치하지 않습니다.',
                          });
                          passwordInput.value = ''; // 비밀번호 틀렸을 시 비워줍니다.
                          popup.style.display = 'none';
                      }
                  });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: '경고',
                    text: '비밀번호를 입력해주세요.',
                });
            }
        });

        passwordInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitPasswordButton.click();
            }
        });
    }
    // 닉네임 중복 체크 기능 초기화
    initializeNicknameCheck();

    // 주소를 두 개의 인풋 박스로 나누어 표시
    splitAddressIntoTwoFields();

    // 폼 제출 시 두 개의 주소 필드를 결합
    document.querySelector('form').addEventListener('submit', function() {
        const line1 = document.getElementById('user-address-line1').value;
        const line2 = document.getElementById('user-address-line2').value;
        document.getElementById('user-full-address').value = line1 + ' ' + line2;
    });
});


// 탈퇴 폼 처리
const deleteForm = document.querySelector('form[action="/mypage/delete"]');
if (deleteForm) {
    deleteForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        if (!password || !passwordConfirm) {
            Swal.fire({
                icon: 'warning',
                title: '경고',
                text: '비밀번호와 비밀번호 확인을 입력해주세요.',
            });
            return;
        }

        if (password !== passwordConfirm) {
            Swal.fire({
                icon: 'error',
                title: '오류',
                text: '비밀번호 확인이 일치하지 않습니다.',
            });
            return;
        }

        fetch('/mypage/validatePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password })
        }).then(response => response.json())
          .then(data => {
              if (data.valid) {
                  deleteForm.submit();
              } else {
                  Swal.fire({
                      icon: 'error',
                      title: '오류',
                      text: '입력한 비밀번호가 현재 비밀번호와 일치하지 않습니다.',
                  });
              }
          });
    });
}

// MBTI 검사 열기
function openMbtiTest() {
    const mbtiWindow = window.open('/matching/mbti', '_blank', 'width=600,height=800');

    window.receiveMbtiResult = function(result) {
        const sanitizedResult = result.replace(/\s+/g, ''); // 값에서 공백을 제거
        document.getElementById('user-mbti').value = sanitizedResult;
    };
}

// 닉네임 중복 체크
let isNicknameValid = false;
let originalNickname = '';

function checkNicknameAvailability() {
    const nicknameInput = document.getElementById('user-nickname');
    const nickname = nicknameInput.value.trim();

    if (nickname === '') {
        Swal.fire({
            icon: 'warning',
            title: '경고',
            text: '닉네임을 입력해주세요.',
        });
        return;
    }

    fetch(`/mypage/checkNickname`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname: nickname })
    }).then(response => response.json())
      .then(data => {
          if (data.isUnique) {
              Swal.fire({
                  icon: 'success',
                  title: '확인 완료',
                  text: '사용 가능한 닉네임입니다.',
              });
              isNicknameValid = true;
          } else {
              Swal.fire({
                  icon: 'error',
                  title: '중복 닉네임',
                  text: '이미 사용 중인 닉네임입니다.',
              });
              isNicknameValid = false;
          }
      });
}

function resetNicknameValidity() {
    const nicknameInput = document.getElementById('user-nickname');
    isNicknameValid = nicknameInput.value.trim() === originalNickname;
}

function validateBeforeSubmit(event) {
    const nicknameInput = document.getElementById('user-nickname');

    if (nicknameInput.value.trim() !== originalNickname && !isNicknameValid) {
        event.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: '중복 체크 필요',
            text: '닉네임 중복 체크를 진행해 주세요.',
        });
    }
}

function initializeNicknameCheck() {
    const nicknameInput = document.getElementById('user-nickname');
    const checkNicknameBtn = document.getElementById('check-nickname-btn');
    const updateBtn = document.getElementById('update-btn');

    originalNickname = nicknameInput.value.trim();

    nicknameInput.addEventListener('input', resetNicknameValidity);
    checkNicknameBtn.addEventListener('click', checkNicknameAvailability);
    updateBtn.addEventListener('click', validateBeforeSubmit);
}

// 주소 2개로 나누기
function splitAddressIntoTwoFields() {
    const fullAddress = document.getElementById('user-full-address').value;

    if (fullAddress) {
        const addressParts = fullAddress.split(' ');
        const line1 = addressParts.slice(0, 3).join(' ');
        const line2 = addressParts.slice(3).join(' ');

        document.getElementById('user-address-line1').value = line1;
        document.getElementById('user-address-line2').value = line2;
    }
}

// 주소 가져오기
function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            let fullRoadAddress = data.roadAddress; // 도로명 주소
            let extraAddress = ''; // 참고 항목

            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
                extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            if (extraAddress !== '') {
                extraAddress = ' (' + extraAddress + ')';
            }

            let finalAddress = fullRoadAddress + extraAddress;

            const addressParts = finalAddress.split(' ');
            const line1 = addressParts.slice(0, 3).join(' ');
            const line2 = addressParts.slice(3).join(' ');

            document.getElementById('user-address-line1').value = line1;
            document.getElementById('user-address-line2').value = line2;

            document.getElementById('user-full-address').value = finalAddress;

            var geocoder = new kakao.maps.services.Geocoder();

            var callback = function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    const longitude = document.getElementById('addr-longitude');
                    const latitude = document.getElementById('addr-latitude');

                    longitude.value = result[0].x;
                    latitude.value = result[0].y;
                }
            };

            geocoder.addressSearch(finalAddress, callback);
        }
    }).open();
}
