/**
 * VoiMeow 앱 소개페이지 - 네비게이션, 로그인, 커뮤니티
 */

const SLIDE_INTERVAL_MS = 4000;
const SLIDE_ACTIVE_CLASS = 'cat-slide-active';
const VALID_LOGIN_ID = 'test';
const VALID_LOGIN_PASSWORD = 'test';
const SESSION_STORAGE_LOGIN_KEY = 'voimeow_logged_in';

/** 페이지 전환 */
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach((section) => {
        section.classList.remove('page-active');
    });
    const targetSection = document.getElementById(`page-${pageId}`);
    if (targetSection) {
        targetSection.classList.add('page-active');
    }
    window.location.hash = pageId === 'home' ? '' : pageId;
}

/** 로그인 상태에 따른 헤더 UI 업데이트 */
function updateHeaderForLoginState(isLoggedIn) {
    const loginLink = document.querySelector('.nav-login-link');
    const loggedInNav = document.querySelector('.nav-logged-in');

    if (loginLink && loggedInNav) {
        loginLink.style.display = isLoggedIn ? 'none' : '';
        loggedInNav.style.display = isLoggedIn ? 'flex' : 'none';
    }
}

/** 로그인 여부 확인 */
function isUserLoggedIn() {
    return sessionStorage.getItem(SESSION_STORAGE_LOGIN_KEY) === 'true';
}

/** 네비게이션 클릭 처리 */
function handleNavigationClick(clickEvent) {
    const link = clickEvent.target.closest('[data-page]');
    if (!link) return;

    clickEvent.preventDefault();
    const pageId = link.getAttribute('data-page');

    if (pageId === 'logout') {
        sessionStorage.removeItem(SESSION_STORAGE_LOGIN_KEY);
        updateHeaderForLoginState(false);
        showPage('login');
        return;
    }

    if (pageId === 'mypage' && isUserLoggedIn()) {
        showPage('logged-in');
        return;
    }

    showPage(pageId || 'home');
}

/** 로그인 폼 제출 처리 */
function handleLoginSubmit(submitEvent) {
    submitEvent.preventDefault();

    const idInput = document.getElementById('login-id');
    const passwordInput = document.getElementById('login-password');

    const enteredId = (idInput?.value || '').trim();
    const enteredPassword = passwordInput?.value || '';

    if (enteredId === VALID_LOGIN_ID && enteredPassword === VALID_LOGIN_PASSWORD) {
        sessionStorage.setItem(SESSION_STORAGE_LOGIN_KEY, 'true');
        updateHeaderForLoginState(true);
        showPage('logged-in');
    } else {
        alert('ID 또는 비밀번호가 올바르지 않습니다. (테스트: ID: test, 비밀번호: test)');
    }
}

/** 배경 슬라이드 전환 */
function switchToNextSlide(slideElements, currentSlideIndex) {
    const totalSlideCount = slideElements.length;
    const nextSlideIndex = (currentSlideIndex + 1) % totalSlideCount;
    slideElements[currentSlideIndex].classList.remove(SLIDE_ACTIVE_CLASS);
    slideElements[nextSlideIndex].classList.add(SLIDE_ACTIVE_CLASS);
    return nextSlideIndex;
}

function startBackgroundSlideShow() {
    const slideElements = document.querySelectorAll('.cat-slide');
    if (slideElements.length === 0) return;
    let currentSlideIndex = 0;
    setInterval(() => {
        currentSlideIndex = switchToNextSlide(slideElements, currentSlideIndex);
    }, SLIDE_INTERVAL_MS);
}

/** 푸터 서비스 버튼 클릭 */
function handleFooterServiceButtonClick(clickEvent) {
    const clickedButton = clickEvent.target;
    if (!clickedButton.classList.contains('footer-service-btn')) return;
    const serviceType = clickedButton.getAttribute('data-service');
    
    if (serviceType === 'chatbot') {
        if (typeof window.openFloatingChatbot === 'function') {
            window.openFloatingChatbot();
        }
        return;
    }
    
    const serviceMessages = {
        remote: '원격지원 서비스가 곧 오픈됩니다.',
        partnership: '파트너십 문의는 고객센터로 연락해 주세요.'
    };
    alert(serviceMessages[serviceType] || '서비스를 준비 중입니다.');
}

/** 검색 실행 */
function executeSearch(searchKeyword) {
    const trimmedKeyword = searchKeyword.trim();
    if (trimmedKeyword.length === 0) return;
    alert(`"${trimmedKeyword}" 검색 기능은 준비 중입니다.`);
}

/** 커뮤니티 샘플 게시글 20개 생성 */
function createSamplePosts(count = 20) {
    const titles = [
        '우리 고양이 첫 목욕 후기', '브리티시숏 키우시는 분들', '사료 추천 부탁드려요',
        '냥이와 함께한 1년', '목걸이 추천해주세요', '건강 체크 방법 알려주세요',
        '고양이 사진 공유해요', '입양 후기 작성합니다', '병원 추천 받아요',
        '간식 어떤 거 드시나요', '털빠짐 관리 팁', '실내에서 놀아주는 법',
        '다른 고양이와 친해지는 법', '야옹이 이름 짓기', '목욕 시기 문의',
        '건강검진 받으셨나요', '사료 급여량 질문', '캣타워 추천', '화장실 교육',
        '스트레스 해소 방법'
    ];
    const authors = ['냥이맘', '고양이사랑', '캣파파', '묘린이', '냥스타', '고영희', '캣초보', '묘묘맘'];
    const thumbnails = [
        'https://placekitten.com/80/80',
        'https://placekitten.com/81/81',
        'https://placekitten.com/82/82'
    ];

    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        title: titles[index % titles.length],
        content: `고양이와 함께하는 행복한 일상에 대한 글입니다. ${index + 1}번째 게시글 내용이 여기에 표시됩니다.`,
        author: authors[index % authors.length],
        thumbnail: thumbnails[index % thumbnails.length],
        comments: [],
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }));
}

/** 커뮤니티 게시글 렌더링 */
function renderCommunityPosts(posts, viewMode = 'card') {
    const container = document.getElementById('community-posts');
    if (!container) return;

    container.className = `community-posts community-posts-${viewMode}`;
    container.innerHTML = posts
        .map(
            (post) => `
        <article class="post-card" data-post-id="${post.id}">
            ${viewMode === 'card' ? `<img class="post-thumb" src="${post.thumbnail}" alt="" loading="lazy">` : ''}
            <div class="post-body">
                <h4>${escapeHtml(post.title)}</h4>
                <p>${escapeHtml(post.content)}</p>
                <div class="post-footer">
                    <span class="post-author">${escapeHtml(post.author)}</span>
                    <span class="post-comments-count">💬 댓글 ${post.comments?.length || 0}</span>
                </div>
            </div>
        </article>
    `
        )
        .join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/** 커뮤니티 검색 필터링 */
function filterPostsBySearch(posts, searchType, keyword) {
    if (!keyword.trim()) return posts;
    const lower = keyword.toLowerCase();
    return posts.filter((post) => {
        const target = post[searchType] || '';
        return String(target).toLowerCase().includes(lower);
    });
}

/** 커뮤니티 이벤트 연결 */
function attachCommunityListeners() {
    const postsContainer = document.getElementById('community-posts');
    const searchTypeSelect = document.getElementById('community-search-type');
    const searchInput = document.getElementById('community-search-input');
    const searchBtn = document.querySelector('.community-search-btn');
    const writeInput = document.getElementById('community-write-input');
    const writeBtn = document.querySelector('.community-write-btn');
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const sliderItems = document.querySelectorAll('.slider-item');

    let allPosts = createSamplePosts(20);
    let currentViewMode = 'card';

    if (typeof window.initializeAdminCommentSystemForPosts === 'function') {
        window.initializeAdminCommentSystemForPosts(allPosts);
    }

    const refreshPosts = () => {
        const searchType = searchTypeSelect?.value || 'title';
        const keyword = searchInput?.value || '';
        const filtered = filterPostsBySearch(allPosts, searchType, keyword);
        renderCommunityPosts(filtered, currentViewMode);
    };

    window.refreshCommunityPostsDisplay = refreshPosts;

    viewModeBtns?.forEach((btn) => {
        btn.addEventListener('click', () => {
            viewModeBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            currentViewMode = btn.getAttribute('data-mode');
            refreshPosts();
        });
    });

    searchBtn?.addEventListener('click', refreshPosts);
    searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') refreshPosts();
    });

    writeBtn?.addEventListener('click', () => {
        const text = writeInput?.value?.trim();
        if (!text) {
            alert('글 내용을 입력해주세요.');
            return;
        }
        const newPost = {
            id: Date.now(),
            title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
            content: text,
            author: '나',
            thumbnail: 'https://placekitten.com/80/80',
            comments: [],
            createdAt: new Date()
        };
        allPosts.unshift(newPost);
        writeInput.value = '';
        refreshPosts();
        
        if (typeof window.addAdminCommentToNewPost === 'function') {
            window.addAdminCommentToNewPost(newPost, allPosts);
        }
    });

    sliderItems?.forEach((item) => {
        item.addEventListener('click', () => {
            item.closest('.slider-items')?.querySelectorAll('.slider-item').forEach((i) => i.classList.remove('active'));
            item.classList.add('active');
            refreshPosts();
        });
    });

    document.querySelectorAll('.category-slider').forEach((slider) => {
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        const items = slider.querySelector('.slider-items');
        if (prevBtn && items) {
            prevBtn.addEventListener('click', () => {
                items.scrollBy({ left: -80, behavior: 'smooth' });
            });
        }
        if (nextBtn && items) {
            nextBtn.addEventListener('click', () => {
                items.scrollBy({ left: 80, behavior: 'smooth' });
            });
        }
    });

    refreshPosts();
}

/** 네비게이션 및 로고 이벤트 연결 */
function attachNavigationListeners() {
    document.querySelectorAll('[data-page]').forEach((link) => {
        link.addEventListener('click', handleNavigationClick);
    });

    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('home');
        });
    }
}

/** 마이페이지 사이드바 및 패널 전환 */
function attachMypageListeners() {
    const sidebarLinks = document.querySelectorAll('.user-sidebar .sidebar-link');
    const mainContent = document.querySelector('.user-main-content');
    const panels = document.querySelectorAll('.mypage-panel');

    sidebarLinks?.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-sidebar');
            if (!targetId) return;

            mainContent?.classList.add('mypage-panel-active');
            sidebarLinks?.forEach((l) => l.classList.remove('sidebar-link-active'));
            link.classList.add('sidebar-link-active');
            panels?.forEach((panel) => {
                const isTarget = panel.id === `mypage-${targetId}`;
                panel.classList.toggle('mypage-panel-visible', isTarget);
            });
        });
    });

    initSubscriptionManagement();
    initCatManagement();
    initFamilySetting();
    initMyPostsTabs();
}

const SUBSCRIPTION_BASE_PRICE = 4900;
const SUBSCRIPTION_EXTRA_CAT_PRICE = 1000;

function initSubscriptionManagement() {
    let catCount = 1;
    const countEl = document.getElementById('subscription-cat-count');
    const totalEl = document.getElementById('subscription-total-price');
    const addBtn = document.getElementById('subscription-add-cat');
    const menuBtn = document.querySelector('.subscription-menu-btn');
    const dropdown = document.querySelector('.subscription-dropdown');

    function updateSubscriptionDisplay() {
        const total = SUBSCRIPTION_BASE_PRICE + (catCount - 1) * SUBSCRIPTION_EXTRA_CAT_PRICE;
        if (countEl) countEl.textContent = catCount;
        if (totalEl) totalEl.textContent = total.toLocaleString();
    }

    addBtn?.addEventListener('click', () => {
        catCount++;
        updateSubscriptionDisplay();
    });

    menuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dropdown?.style.display === 'none' || !dropdown?.style.display;
        dropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
        if (dropdown) dropdown.style.display = 'none';
    });

    dropdown?.addEventListener('click', (e) => {
        e.stopPropagation();
        const btn = e.target.closest('.subscription-dropdown-item');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        if (action === 'cancel') {
            if (confirm('구독을 취소하시겠습니까?')) alert('구독이 취소되었습니다.');
        } else if (action === 'change') {
            catCount++;
            updateSubscriptionDisplay();
        }
        dropdown.style.display = 'none';
    });

    updateSubscriptionDisplay();
}

function initCatManagement() {
    const container = document.getElementById('cat-cards-container');
    const addBtn = document.getElementById('cat-add-btn');

    function createCatCard() {
        const card = document.createElement('div');
        card.className = 'cat-card';
        card.innerHTML = `
            <div class="cat-card-photo">
                <img src="https://placekitten.com/120/120" alt="고양이 사진" class="cat-photo-img">
                <input type="file" class="cat-photo-input" accept="image/*" style="display: none;">
            </div>
            <input type="text" class="cat-name-input" placeholder="이름" value="">
        `;
        const photoArea = card.querySelector('.cat-card-photo');
        const photoInput = card.querySelector('.cat-photo-input');
        photoArea?.addEventListener('click', () => photoInput?.click());
        photoInput?.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = card.querySelector('.cat-photo-img');
                    if (img) img.src = ev.target?.result || '';
                };
                reader.readAsDataURL(file);
            }
        });
        return card;
    }

    addBtn?.addEventListener('click', () => {
        container?.appendChild(createCatCard());
    });
}

function initFamilySetting() {
    const container = document.getElementById('family-dashboards');
    const addBtn = document.getElementById('family-add-btn');

    function createFamilyDashboard() {
        const item = document.createElement('div');
        item.className = 'family-dashboard-item';
        item.innerHTML = `
            <label class="family-dashboard-label">고객ID</label>
            <input type="text" class="family-id-input" placeholder="ID 입력 후 Enter">
            <div class="family-verify-area" style="display: none;">
                <p class="family-verify-msg">인증번호전송됩니다</p>
                <input type="text" class="family-verify-input" placeholder="인증번호 입력" maxlength="6">
            </div>
        `;
        const idInput = item.querySelector('.family-id-input');
        const verifyArea = item.querySelector('.family-verify-area');
        idInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (idInput.value.trim()) verifyArea.style.display = 'block';
            }
        });
        return item;
    }

    document.querySelectorAll('.family-id-input').forEach((input) => {
        const verifyArea = input.closest('.family-dashboard-item')?.querySelector('.family-verify-area');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (input.value.trim()) verifyArea.style.display = 'block';
            }
        });
    });

    addBtn?.addEventListener('click', () => {
        container?.appendChild(createFamilyDashboard());
    });
}

function initMyPostsTabs() {
    const tabButtons = document.querySelectorAll('.my-posts-tab');
    const communityPostsList = document.getElementById('my-community-posts');
    const supportPostsList = document.getElementById('my-support-posts');

    tabButtons?.forEach((tabButton) => {
        tabButton.addEventListener('click', () => {
            const postType = tabButton.getAttribute('data-post-type');
            
            tabButtons.forEach((btn) => btn.classList.remove('active'));
            tabButton.classList.add('active');
            
            if (postType === 'community') {
                communityPostsList?.classList.add('my-posts-list-active');
                supportPostsList?.classList.remove('my-posts-list-active');
            } else if (postType === 'support') {
                communityPostsList?.classList.remove('my-posts-list-active');
                supportPostsList?.classList.add('my-posts-list-active');
            }
        });
    });
    
    document.querySelectorAll('.my-post-item').forEach((postItem) => {
        postItem.addEventListener('click', () => {
            alert('게시글 상세 보기 기능은 준비 중입니다.');
        });
    });
}

/** 로그인 폼 이벤트 연결 */
function attachLoginListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
}

/** 고객센터 이벤트 연결 */
function attachSupportListeners() {
    const navItems = document.querySelectorAll('.support-nav-item');
    const panels = document.querySelectorAll('.support-panel');
    const remoteModal = document.getElementById('remote-modal');
    const remoteTriggerBtn = document.querySelector('.remote-trigger-btn');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const inquiryWriteTrigger = document.querySelector('.inquiry-write-trigger');
    const inquiryFormWrapper = document.getElementById('inquiry-form-modal');
    const inquiryForm = document.getElementById('inquiry-form');
    const inquiryCancelBtn = document.querySelector('.inquiry-cancel-btn');
    const inquiryPostsContainer = document.getElementById('inquiry-posts');
    const faqSearchBtn = document.querySelector('.faq-search-btn');
    const faqSearchInput = document.getElementById('faq-search-input');

    let inquiryPosts = [];

    function switchSupportPanel(panelId) {
        navItems.forEach((item) => {
            item.classList.toggle('active', item.getAttribute('data-support') === panelId);
        });
        panels.forEach((panel) => {
            panel.classList.toggle('support-panel-active', panel.id === `support-${panelId}`);
        });
    }

    navItems?.forEach((item) => {
        item.addEventListener('click', () => {
            switchSupportPanel(item.getAttribute('data-support'));
        });
    });

    remoteTriggerBtn?.addEventListener('click', () => {
        if (remoteModal) remoteModal.style.display = 'flex';
    });

    modalCloseBtn?.addEventListener('click', () => {
        if (remoteModal) remoteModal.style.display = 'none';
    });

    remoteModal?.addEventListener('click', (e) => {
        if (e.target === remoteModal) remoteModal.style.display = 'none';
    });

    inquiryWriteTrigger?.addEventListener('click', () => {
        if (inquiryFormWrapper) inquiryFormWrapper.style.display = 'block';
    });

    inquiryCancelBtn?.addEventListener('click', () => {
        if (inquiryFormWrapper) inquiryFormWrapper.style.display = 'none';
    });

    inquiryForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('inquiry-title')?.value?.trim();
        const content = document.getElementById('inquiry-content')?.value?.trim();
        const password = document.getElementById('inquiry-password')?.value;
        if (!title || !content || !password) {
            alert('제목, 내용, 패스워드를 모두 입력해주세요.');
            return;
        }
        inquiryPosts.unshift({ title, content, password, author: '나' });
        inquiryForm.reset();
        if (inquiryFormWrapper) inquiryFormWrapper.style.display = 'none';
        renderInquiryPosts();
    });

    function renderInquiryPosts() {
        if (!inquiryPostsContainer) return;
        inquiryPostsContainer.innerHTML = inquiryPosts
            .map(
                (post) => `
            <div class="inquiry-post-item">
                <h4>${escapeHtml(post.title)}</h4>
                <p>${escapeHtml(post.content)}</p>
            </div>
        `
            )
            .join('');
    }

    faqSearchBtn?.addEventListener('click', () => {
        const keyword = faqSearchInput?.value?.trim();
        if (keyword) alert(`"${keyword}" 검색 기능은 준비 중입니다.`);
    });

    document.querySelectorAll('.faq-item')?.forEach((item) => {
        item.addEventListener('click', () => {
            const faqId = item.getAttribute('data-faq');
            const faqContents = {
                install: '앱스토어 또는 구글플레이에서 VoiMeow를 검색 후 설치해주세요.',
                'install-error': '설치 중 오류가 발생하면 기기 재시작 후 다시 시도해주세요. 문제가 지속되면 고객센터로 문의해주세요.',
                'cat-setting': '앱 로그인 후 고양이설정 메뉴에서 이름, 사진(카메라 촬영), 목걸이 색상을 설정하고 확인을 눌러주세요.',
                subscription: '마이페이지 > 구독서비스관리에서 현재 구독 상태를 확인하고 변경할 수 있습니다.'
            };
            alert(faqContents[faqId] || '준비 중입니다.');
        });
    });

    renderInquiryPosts();
}

/** 검색 이벤트 연결 */
function attachSearchListeners() {
    const searchInput = document.getElementById('site-search-input');
    const searchButton = document.querySelector('.header-search-btn');
    if (!searchInput || !searchButton) return;
    const handleSearchSubmit = () => executeSearch(searchInput.value);
    searchButton.addEventListener('click', handleSearchSubmit);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchSubmit();
        }
    });
}

/** 해시 변경 시 페이지 전환 */
function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    const pageMap = {
        company: 'company',
        login: 'login',
        usage: 'usage',
        community: 'community',
        notice: 'notice',
        event: 'event',
        support: 'support',
        'logged-in': 'logged-in'
    };
    let pageId = pageMap[hash] || 'home';
    if (pageId === 'logged-in' && !isUserLoggedIn()) {
        pageId = 'login';
    }
    showPage(pageId);
}

/** 모바일 햄버거 메뉴 토글 */
function initializeHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNavigation = document.getElementById('mainNavigation');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');

    function openMobileNav() {
        mainNavigation?.classList.add('nav-open');
        mobileNavOverlay?.classList.add('overlay-visible');
        hamburgerBtn?.classList.add('hamburger-active');
        hamburgerBtn?.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        mainNavigation?.classList.remove('nav-open');
        mobileNavOverlay?.classList.remove('overlay-visible');
        hamburgerBtn?.classList.remove('hamburger-active');
        hamburgerBtn?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburgerBtn?.addEventListener('click', () => {
        const isOpen = mainNavigation?.classList.contains('nav-open');
        isOpen ? closeMobileNav() : openMobileNav();
    });

    mobileNavOverlay?.addEventListener('click', closeMobileNav);

    mainNavigation?.querySelectorAll('.nav-link').forEach((navLink) => {
        navLink.addEventListener('click', closeMobileNav);
    });
}

/** 초기화 */
function initializePage() {
    startBackgroundSlideShow();
    document.querySelector('.site-footer')?.addEventListener('click', handleFooterServiceButtonClick);
    attachSearchListeners();
    attachNavigationListeners();
    attachLoginListeners();
    attachCommunityListeners();
    attachSupportListeners();
    attachMypageListeners();
    initializeHamburgerMenu();

    updateHeaderForLoginState(isUserLoggedIn());
    if (isUserLoggedIn()) {
        const loginLink = document.querySelector('.nav-link[data-page="login"]');
        if (loginLink?.closest('a')) loginLink.closest('a').style.display = 'none';
    }

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
}

document.addEventListener('DOMContentLoaded', initializePage);
