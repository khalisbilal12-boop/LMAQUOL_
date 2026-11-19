document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-3d-canvas');
    let cyberMesh = null;

    if (typeof THREE !== 'undefined' && canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

        function updateCameraDistance() {
            if (window.innerWidth < 640) {
                camera.position.z = 8.5;
            } else if (window.innerWidth < 900) {
                camera.position.z = 7;
            } else {
                camera.position.z = 6;
            }
        }
        updateCameraDistance();

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.IcosahedronGeometry(2.4, 1);
        const materialBlue = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            wireframe: true,
            transparent: true,
            opacity: 0.22
        });
        cyberMesh = new THREE.Mesh(geometry, materialBlue);
        scene.add(cyberMesh);

        const ringGeo = new THREE.TorusGeometry(3.4, 0.03, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xff003c,
            transparent: true,
            opacity: 0.45
        });
        const cyberRing = new THREE.Mesh(ringGeo, ringMat);
        cyberRing.rotation.x = Math.PI / 3;
        scene.add(cyberRing);

        const particlesGeo = new THREE.BufferGeometry();
        const count = 180;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 16;
            positions[i + 1] = (Math.random() - 0.5) * 16;
            positions[i + 2] = (Math.random() - 0.5) * 12;

            const isBlue = Math.random() > 0.5;
            colors[i] = isBlue ? 0.0 : 1.0;
            colors[i + 1] = isBlue ? 0.95 : 0.0;
            colors[i + 2] = isBlue ? 1.0 : 0.23;
        }

        particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMat = new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        function animate3D() {
            requestAnimationFrame(animate3D);
            cyberMesh.rotation.y += 0.003;
            cyberMesh.rotation.x += 0.002;
            cyberRing.rotation.z -= 0.005;
            cyberRing.rotation.y += 0.002;
            particles.rotation.y -= 0.001;
            renderer.render(scene, camera);
        }
        animate3D();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            updateCameraDistance();
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            syncBottomNavSlider();
        });
    }

    const powerSwitch = document.getElementById('powerSwitch');
    const switchLabel = document.getElementById('switchLabel');
    const neonText = document.getElementById('neonText');
    const neonFrame = document.getElementById('neonFrame');
    const neonSub = document.querySelector('.neon-sub');
    const colorDots = document.querySelectorAll('.color-dot');
    const bgMusic = document.getElementById('bgMusic');

    let isNeonOn = false;
    let currentTheme = 'dual';

    function applyNeonGlow() {
        if (!isNeonOn) {
            neonText.style.color = '#262938';
            neonText.style.textShadow = 'none';
            neonFrame.style.borderColor = '#1a1d2b';
            neonFrame.style.boxShadow = 'inset 0 0 20px #000000';
            neonSub.style.color = '#2f3346';
            neonText.classList.remove('flicker-anim');
            return;
        }

        neonText.classList.remove('flicker-anim');
        void neonText.offsetWidth;
        neonText.classList.add('flicker-anim');

        neonText.style.color = '#ffffff';
        neonSub.style.color = '#cbd5e1';

        if (currentTheme === 'dual') {
            neonText.style.textShadow = '0 0 5px #fff, 0 0 15px #00f3ff, 0 0 30px #00f3ff, 0 0 55px #ff003c';
            neonFrame.style.borderColor = '#00f3ff';
            neonFrame.style.boxShadow = '0 0 25px rgba(0, 243, 255, 0.25), inset 0 0 25px rgba(255, 0, 60, 0.25)';
        } else if (currentTheme === 'blue') {
            neonText.style.textShadow = '0 0 5px #fff, 0 0 15px #00f3ff, 0 0 35px #00f3ff, 0 0 70px #00f3ff';
            neonFrame.style.borderColor = '#00f3ff';
            neonFrame.style.boxShadow = '0 0 30px rgba(0, 243, 255, 0.35), inset 0 0 20px rgba(0, 243, 255, 0.2)';
        } else if (currentTheme === 'red') {
            neonText.style.textShadow = '0 0 5px #fff, 0 0 15px #ff003c, 0 0 35px #ff003c, 0 0 70px #ff003c';
            neonFrame.style.borderColor = '#ff003c';
            neonFrame.style.boxShadow = '0 0 30px rgba(255, 0, 60, 0.35), inset 0 0 20px rgba(255, 0, 60, 0.2)';
        }
    }

    function startMusicPlayback() {
        if (bgMusic && bgMusic.paused && !document.body.classList.contains('dashboard-active')) {
            bgMusic.volume = 0.7;
            bgMusic.play().catch(e => console.log("Waiting for user interaction:", e));
        }
    }

    startMusicPlayback();

    ['click', 'touchstart', 'keydown'].forEach(event => {
        window.addEventListener(event, startMusicPlayback, { once: true });
    });

    powerSwitch.addEventListener('click', () => {
        isNeonOn = !isNeonOn;
        powerSwitch.classList.toggle('on', isNeonOn);
        switchLabel.textContent = isNeonOn ? 'ON' : 'OFF';
        applyNeonGlow();
        startMusicPlayback();
    });

    colorDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            colorDots.forEach((d) => d.classList.remove('active'));
            dot.classList.add('active');
            currentTheme = dot.dataset.theme;
            if (!isNeonOn) {
                isNeonOn = true;
                powerSwitch.classList.add('on');
                switchLabel.textContent = 'ON';
            }
            applyNeonGlow();
            startMusicPlayback();
        });
    });

    const signInContainer = document.getElementById('signInContainer');
    const signUpContainer = document.getElementById('signUpContainer');
    const toSignUpBtn = document.getElementById('toSignUpBtn');
    const toSignInBtn = document.getElementById('toSignInBtn');

    toSignUpBtn.addEventListener('click', () => {
        signInContainer.classList.add('hidden-form');
        signUpContainer.classList.remove('hidden-form');
    });

    toSignInBtn.addEventListener('click', () => {
        signUpContainer.classList.add('hidden-form');
        signInContainer.classList.remove('hidden-form');
    });

    const tiltCard = document.getElementById('tiltCard');

    function handle3DTilt(clientX, clientY, sensitivity) {
        if (document.body.classList.contains('dashboard-active')) return;
        const xAxis = (window.innerWidth / 2 - clientX) / sensitivity;
        const yAxis = (window.innerHeight / 2 - clientY) / sensitivity;

        tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;

        if (cyberMesh) {
            cyberMesh.position.x = -xAxis * 0.03;
            cyberMesh.position.y = yAxis * 0.03;
        }
    }

    document.addEventListener('mousemove', (e) => {
        handle3DTilt(e.clientX, e.clientY, 25);
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            handle3DTilt(e.touches[0].clientX, e.touches[0].clientY, 35);
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (tiltCard) tiltCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginWrapper = document.getElementById('loginWrapper');
    const dashboardView = document.getElementById('dashboardView');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    function enterDashboard(agentName) {
        const cleanName = (agentName || 'AGENT').toUpperCase();
        userDisplay.textContent = cleanName;

        const clientFullNameInput = document.getElementById('clientFullNameInput');
        if (clientFullNameInput) {
            clientFullNameInput.value = '';
        }

        if (bgMusic) {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }

        loginWrapper.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        document.body.classList.add('dashboard-active');
        switchCamiloinTab('home');
        requestAnimationFrame(syncBottomNavSlider);
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = document.getElementById('emailInput').value;
        enterDashboard(emailVal.split('@')[0]);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('regNameInput').value;
        enterDashboard(fullName);
    });

    logoutBtn.addEventListener('click', () => {
        document.body.classList.remove('dashboard-active');
        dashboardView.classList.add('hidden');
        loginWrapper.classList.remove('hidden');
        startMusicPlayback();
    });

    // التنقل السلس بين التبويبات وموجة النيون (4 - NEON WAVE)
    const navItems = Array.from(document.querySelectorAll('.nav-item'));
    const tabPanels = document.querySelectorAll('.tab-panel');
    const sideDrawer = document.getElementById('sideDrawer');
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');

    function syncBottomNavSlider() {
        const wavePath = document.getElementById('neonWavePath');
        const navEl = document.getElementById('bottomNav');
        if (!wavePath || !navEl || !navItems.length) return;

        const activeIdx = navItems.findIndex(item => item.classList.contains('active'));
        const idx = activeIdx >= 0 ? activeIdx : 0;
        const activeBtn = navItems[idx];

        const navRect = navEl.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        if (!navRect.width || !btnRect.width) return;

        const scaleX = 500 / navRect.width;
        const centerX = ((btnRect.left - navRect.left) + btnRect.width / 2) * scaleX;
        const halfDip = 36;
        const baseY = 18;
        const peakY = 4;

        const leftStart = Math.max(12, centerX - halfDip - 16);
        const rightEnd = Math.min(488, centerX + halfDip + 16);

        const d = [
            `M 8,${baseY}`,
            `L ${leftStart},${baseY}`,
            `C ${centerX - halfDip},${baseY} ${centerX - 20},${peakY} ${centerX},${peakY}`,
            `C ${centerX + 20},${peakY} ${centerX + halfDip},${baseY} ${rightEnd},${baseY}`,
            `L 492,${baseY}`
        ].join(' ');

        wavePath.setAttribute('d', d);
    }

    function openDrawer() {
        sideDrawer?.classList.remove('hidden');
        drawerBackdrop?.classList.remove('hidden');
    }

    function closeDrawer() {
        sideDrawer?.classList.add('hidden');
        drawerBackdrop?.classList.add('hidden');
    }

    menuToggleBtn?.addEventListener('click', openDrawer);
    closeDrawerBtn?.addEventListener('click', closeDrawer);
    drawerBackdrop?.addEventListener('click', closeDrawer);

    function switchCamiloinTab(tabName) {
        tabPanels.forEach(p => p.classList.remove('active'));
        const target = document.getElementById('tab-' + tabName);
        if (target) {
            target.classList.remove('active');
            void target.offsetWidth;
            target.classList.add('active');
        }

        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabName);
        });
        syncBottomNavSlider();

        closeDrawer();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => switchCamiloinTab(item.dataset.tab));
    });

    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => switchCamiloinTab(btn.dataset.goto));
    });

    document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', () => {
            const action = link.dataset.drawer;
            if (action === 'home') {
                switchCamiloinTab('home');
            } else if (action === 'inspect') {
                setBookingMode('inspect');
                resetBookingFormToStep1();
                switchCamiloinTab('booking');
            } else if (action === 'repair') {
                setBookingMode('repair');
                resetBookingFormToStep1();
                switchCamiloinTab('booking');
            } else if (action === 'sos') {
                openSosScreen();
            } else if (action === 'tech') {
                switchCamiloinTab('tech');
            } else if (action === 'partners') {
                switchCamiloinTab('partners');
            } else if (action === 'admin') {
                switchCamiloinTab('admin');
            }
        });
    });

    // بيانات الفنيين برمز PIN من 4 أرقام
    const TECHNICIANS_BY_PIN = {
        '1111': 'سفيان فنون',
        '2222': 'بلال كاميليون',
        '3333': 'ضياء عبد القدوس',
        '4444': 'حميدة ديانوغنوستيك'
    };

    let activeTechnician = null;
    let activeMissionOrderId = null;

    let orders = [];
    let selectedOrderId = null;
    let ratingsList = [];
    let selectedStars = 5;
    let currentAdminFilter = 'الكل';

    const emptyOrdersState = document.getElementById('emptyOrdersState');
    const ordersListContainer = document.getElementById('ordersListContainer');
    const selectedOrderDetailsCard = document.getElementById('selectedOrderDetailsCard');

    const emptyReportOrdersState = document.getElementById('emptyReportOrdersState');
    const reportOrdersListContainer = document.getElementById('reportOrdersListContainer');
    const reportViewerCard = document.getElementById('reportViewerCard');

    function generateShortOrderCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'CML-';
        for (let i = 0; i < 8; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    }

    function getOrderById(id) {
        return orders.find(o => o.id === id) || null;
    }

    function renderTrackingOrderDetails(order) {
        if (!order) return;
        selectedOrderId = order.id;
        selectedOrderDetailsCard.classList.remove('hidden');

        document.getElementById('trackOrderCode').textContent = order.id;
        document.getElementById('activeOrderIdText').textContent = order.id;
        document.getElementById('activeServiceText').textContent = order.serviceLabel;
        document.getElementById('activeCarText').textContent = order.carFull;
        document.getElementById('activeFuelText').textContent = order.fuel;
        document.getElementById('activeDetailText').textContent = order.detail;
        document.getElementById('activeAmountText').textContent = `DH ${order.amount}`;
        document.getElementById('activeLocText').textContent = order.locationFull;
        document.getElementById('activeClientText').textContent = order.clientInfo;
        document.getElementById('activeTechText').textContent = order.assignedTech || 'بانتظار القبول';
        document.getElementById('activeStatusText').textContent = order.status;

        const step3 = document.getElementById('timelineStep3');
        const statusTitle = document.getElementById('timelineStatusTitle');
        const statusSub = document.getElementById('timelineStatusSub');

        if (order.status === 'مكتمل') {
            statusTitle.textContent = 'تم إنجاز الفحص وإصدار التقرير الرقمي';
            statusSub.textContent = 'يمكنك الاطلاع على التقرير وتقييم الفني';
            step3?.classList.add('done');
        } else if (order.status === 'جاري الفحص') {
            statusTitle.textContent = `الفني ${order.assignedTech || ''} يجري الفحص الآن`;
            statusSub.textContent = 'جاري فحص المعايير الميكانيكية والإلكترونية';
            step3?.classList.remove('done');
        } else if (order.status === 'في الطريق إليك') {
            statusTitle.textContent = `الفني ${order.assignedTech || ''} في الطريق إليك`;
            statusSub.textContent = 'تم تأكيد القبول والانطلاق نحو موقعك';
            step3?.classList.remove('done');
        } else if (order.status === 'تم قبول الطلب') {
            statusTitle.textContent = `تم قبول الطلب من طرف ${order.assignedTech || 'الفني'}`;
            statusSub.textContent = 'بانتظار بدء التوجه إلى الموقع';
            step3?.classList.remove('done');
        } else {
            statusTitle.textContent = 'بانتظار قبول الفني';
            statusSub.textContent = 'الطلب معروض على رادار الفنيين المباشر';
            step3?.classList.remove('done');
        }

        const trackedCarPhotoBox = document.getElementById('trackedCarPhotoBox');
        const trackedCarPhotoImg = document.getElementById('trackedCarPhotoImg');
        if (order.photoDataUrl) {
            trackedCarPhotoImg.src = order.photoDataUrl;
            trackedCarPhotoBox.classList.remove('hidden');
        } else {
            trackedCarPhotoBox.classList.add('hidden');
        }

        document.querySelectorAll('#ordersListContainer .order-item-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.orderId === order.id);
        });
    }

    function renderReportViewer(order) {
        if (!order) return;
        selectedOrderId = order.id;
        reportViewerCard.classList.remove('hidden');

        document.getElementById('viewerOrderCode').textContent = order.id;
        document.getElementById('viewerCarLabel').textContent = `${order.carFull} - ${order.serviceLabel}`;

        const rep = order.digitalReport;
        if (!rep) {
            document.getElementById('viewerHealthScore').textContent = '-- /100';
            document.getElementById('vScoreEngine').textContent = 'قيد الانتظار';
            document.getElementById('vScoreGear').textContent = 'قيد الانتظار';
            document.getElementById('vScoreBrakes').textContent = 'قيد الانتظار';
            document.getElementById('vScoreSusp').textContent = 'قيد الانتظار';
            document.getElementById('vScoreElec').textContent = 'قيد الانتظار';
            document.getElementById('vScoreBody').textContent = 'قيد الانتظار';
            document.getElementById('vScoreCabin').textContent = 'قيد الانتظار';
            document.getElementById('vScoreTires').textContent = 'قيد الانتظار';
            document.getElementById('vOverallState').textContent = order.status;
            document.getElementById('vRecommendations').textContent = '-';
            document.getElementById('vTechNotes').textContent = 'لم يتم إصدار التقرير بعد من بوابة التقني.';
        } else {
            document.getElementById('viewerHealthScore').textContent = `${rep.healthScore} /100`;
            document.getElementById('vScoreEngine').textContent = `${rep.scores.engine} / 10`;
            document.getElementById('vScoreGear').textContent = `${rep.scores.gearbox} / 10`;
            document.getElementById('vScoreBrakes').textContent = `${rep.scores.brakes} / 10`;
            document.getElementById('vScoreSusp').textContent = `${rep.scores.suspension} / 10`;
            document.getElementById('vScoreElec').textContent = `${rep.scores.electronics} / 10`;
            document.getElementById('vScoreBody').textContent = `${rep.scores.body} / 10`;
            document.getElementById('vScoreCabin').textContent = `${rep.scores.cabin} / 10`;
            document.getElementById('vScoreTires').textContent = `${rep.scores.tires} / 10`;
            document.getElementById('vOverallState').textContent = `خارجية: ${rep.states.exterior} | مقصورة: ${rep.states.cabin} | ميكانيكية: ${rep.states.mechanical}`;
            document.getElementById('vRecommendations').textContent = rep.recommendations || 'لا توجد توصيات إضافية';
            document.getElementById('vTechNotes').textContent = rep.notes || 'تم الفحص بنجاح';
        }

        document.querySelectorAll('#reportOrdersListContainer .order-item-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.orderId === order.id);
        });
    }

    function renderAllOrderViews() {
        if (!orders.length) {
            emptyOrdersState.classList.remove('hidden');
            ordersListContainer.innerHTML = '';
            selectedOrderDetailsCard.classList.add('hidden');

            emptyReportOrdersState.classList.remove('hidden');
            reportOrdersListContainer.innerHTML = '';
            reportViewerCard.classList.add('hidden');
            renderTechRadarAndTasks();
            renderAdminStats();
            return;
        }

        emptyOrdersState.classList.add('hidden');
        emptyReportOrdersState.classList.add('hidden');
        ordersListContainer.innerHTML = '';
        reportOrdersListContainer.innerHTML = '';

        orders.forEach(order => {
            const thumbHtml = order.photoDataUrl
                ? `<img src="${order.photoDataUrl}" alt="${order.carFull}" class="order-item-thumb">`
                : `<div class="empty-car-icon" style="font-size:1.4rem;margin:0;">&#128663;</div>`;

            const trackCard = document.createElement('div');
            trackCard.className = 'order-item-card' + (order.id === selectedOrderId ? ' selected' : '');
            trackCard.dataset.orderId = order.id;
            trackCard.innerHTML = `
                <div class="order-item-left">
                    ${thumbHtml}
                    <div>
                        <div class="order-item-title">${order.carFull} &bull; ${order.serviceLabel}</div>
                        <div class="order-item-sub">رقم الطلب: ${order.id} &bull; DH ${order.amount}</div>
                    </div>
                </div>
                <span class="order-item-badge">${order.status}</span>
            `;
            trackCard.addEventListener('click', () => renderTrackingOrderDetails(order));
            ordersListContainer.appendChild(trackCard);

            const repCard = document.createElement('div');
            repCard.className = 'order-item-card' + (order.id === selectedOrderId ? ' selected' : '');
            repCard.dataset.orderId = order.id;
            repCard.innerHTML = `
                <div class="order-item-left">
                    ${thumbHtml}
                    <div>
                        <div class="order-item-title">${order.carFull} &bull; ${order.clientName}</div>
                        <div class="order-item-sub">${order.digitalReport ? 'التقرير الرقمي جاهز' : 'بانتظار إتمام التقرير'} &bull; ${order.id}</div>
                    </div>
                </div>
                <span class="order-item-badge">${order.status}</span>
            `;
            repCard.addEventListener('click', () => renderReportViewer(order));
            reportOrdersListContainer.appendChild(repCard);
        });

        renderTechRadarAndTasks();
        renderAdminStats();
    }

    function renderTechRadarAndTasks() {
        const radarContainer = document.getElementById('techRadarContainer');
        const myTasksContainer = document.getElementById('techMyTasksContainer');
        if (!radarContainer || !myTasksContainer) return;

        const pendingOrders = orders.filter(o => o.status === 'بانتظار فني');
        if (!pendingOrders.length) {
            radarContainer.innerHTML = '<p class="admin-empty-msg">لا توجد طلبات جديدة في الدار البيضاء حالياً.</p>';
        } else {
            radarContainer.innerHTML = '';
            pendingOrders.forEach(order => {
                const card = document.createElement('div');
                card.className = 'radar-order-card';
                card.innerHTML = `
                    <div class="admin-order-top">
                        <strong>${order.serviceLabel} &bull; ${order.carFull}</strong>
                        <span class="order-item-badge">بانتظار فني</span>
                    </div>
                    <div class="order-item-sub">${order.clientInfo} &bull; ${order.locationFull} &bull; DH ${order.amount}</div>
                    <div class="radar-action-row">
                        <button type="button" class="accept-btn" data-accept-id="${order.id}">قبول</button>
                        <button type="button" class="reject-btn" data-reject-id="${order.id}">رفض</button>
                    </div>
                `;
                card.querySelector('[data-accept-id]')?.addEventListener('click', () => {
                    order.assignedTech = activeTechnician ? activeTechnician.name : 'سفيان فنون';
                    order.status = 'تم قبول الطلب';
                    activeMissionOrderId = order.id;
                    renderAllOrderViews();
                    renderTechMissionPanel(order);
                    if (selectedOrderId === order.id) renderTrackingOrderDetails(order);
                });
                card.querySelector('[data-reject-id]')?.addEventListener('click', () => {
                    card.remove();
                    if (!radarContainer.children.length) {
                        radarContainer.innerHTML = '<p class="admin-empty-msg">لا توجد طلبات جديدة في الدار البيضاء حالياً.</p>';
                    }
                });
                radarContainer.appendChild(card);
            });
        }

        const myOrders = orders.filter(o => o.status !== 'بانتظار فني');
        if (!myOrders.length) {
            myTasksContainer.innerHTML = '<p class="admin-empty-msg">لا توجد مهام مقبولة أو مكتملة حالياً.</p>';
        } else {
            myTasksContainer.innerHTML = '';
            myOrders.forEach(order => {
                const item = document.createElement('div');
                item.className = 'order-item-card' + (order.id === activeMissionOrderId ? ' selected' : '');
                item.innerHTML = `
                    <div>
                        <div class="order-item-title">${order.serviceLabel} &bull; ${order.carFull}</div>
                        <div class="order-item-sub">${order.clientInfo} &bull; ${order.locationFull}</div>
                    </div>
                    <span class="order-item-badge">${order.status}</span>
                `;
                item.addEventListener('click', () => {
                    activeMissionOrderId = order.id;
                    renderTechMissionPanel(order);
                    renderTechRadarAndTasks();
                });
                myTasksContainer.appendChild(item);
            });
        }

        const currentMission = getOrderById(activeMissionOrderId) || myOrders[0];
        if (currentMission) {
            renderTechMissionPanel(currentMission);
        } else {
            document.getElementById('techActiveMissionCard')?.classList.add('hidden');
        }
    }

    function renderTechMissionPanel(order) {
        const panel = document.getElementById('techActiveMissionCard');
        const btnsBox = document.getElementById('missionStageButtonsBox');
        if (!panel || !btnsBox || !order) return;

        panel.classList.remove('hidden');
        document.getElementById('missionOrderCode').textContent = order.id;
        document.getElementById('missionServiceText').textContent = order.serviceLabel;
        document.getElementById('missionClientText').textContent = order.clientInfo;
        document.getElementById('missionCarText').textContent = `${order.carFull} (${order.fuel})`;
        document.getElementById('missionLocText').textContent = order.locationFull;
        document.getElementById('missionStatusText').textContent = order.status;

        btnsBox.innerHTML = '';

        if (order.status === 'تم قبول الطلب') {
            const btnOnWay = document.createElement('button');
            btnOnWay.type = 'button';
            btnOnWay.className = 'btn-neon-blue full-w';
            btnOnWay.textContent = 'أنا في الطريق';
            btnOnWay.addEventListener('click', () => {
                order.status = 'في الطريق إليك';
                renderAllOrderViews();
                if (selectedOrderId === order.id) renderTrackingOrderDetails(order);
            });
            btnsBox.appendChild(btnOnWay);
        } else if (order.status === 'في الطريق إليك') {
            const btnInspecting = document.createElement('button');
            btnInspecting.type = 'button';
            btnInspecting.className = 'btn-neon-blue full-w';
            btnInspecting.textContent = 'جاري الفحص';
            btnInspecting.addEventListener('click', () => {
                order.status = 'جاري الفحص';
                renderAllOrderViews();
                if (selectedOrderId === order.id) renderTrackingOrderDetails(order);
            });
            btnsBox.appendChild(btnInspecting);
        } else if (order.status === 'جاري الفحص') {
            const btnFinish = document.createElement('button');
            btnFinish.type = 'button';
            btnFinish.className = 'btn-neon-blue full-w';
            btnFinish.textContent = 'إنهاء الفحص';
            btnFinish.addEventListener('click', () => {
                openDigitalReportForOrder(order);
            });
            btnsBox.appendChild(btnFinish);
        } else if (order.status === 'مكتمل') {
            const btnEditReport = document.createElement('button');
            btnEditReport.type = 'button';
            btnEditReport.className = 'btn-glass full-w';
            btnEditReport.textContent = 'عرض / تعديل التقرير الرقمي';
            btnEditReport.addEventListener('click', () => {
                openDigitalReportForOrder(order);
            });
            btnsBox.appendChild(btnEditReport);
        }
    }

    const CRITERIA_LIST = [
        { key: 'engine', label: 'المحرك' },
        { key: 'gearbox', label: 'ناقل الحركة' },
        { key: 'brakes', label: 'الفرامل' },
        { key: 'suspension', label: 'التعليق والتوجيه' },
        { key: 'electronics', label: 'الكهرباء والأجهزة' },
        { key: 'body', label: 'الهيكل والطلاء' },
        { key: 'cabin', label: 'المقصورة الداخلية' },
        { key: 'tires', label: 'الإطارات' }
    ];

    let currentReportScores = {
        engine: 8,
        gearbox: 8,
        brakes: 8,
        suspension: 8,
        electronics: 8,
        body: 8,
        cabin: 8,
        tires: 8
    };

    let currentReportStates = {
        exterior: 'ممتازة',
        cabin: 'جيدة',
        mechanical: 'ممتازة'
    };

    function computeHealthScore() {
        const vals = Object.values(currentReportScores);
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        return Math.round(avg * 10);
    }

    function renderCriteriaControls() {
        const container = document.getElementById('criteriaRatingContainer');
        if (!container) return;
        container.innerHTML = '';

        CRITERIA_LIST.forEach(item => {
            const block = document.createElement('div');
            block.className = 'criterion-block';
            block.innerHTML = `<span class="criterion-title">${item.label}</span>`;

            const grid = document.createElement('div');
            grid.className = 'scale-ten-grid';

            for (let n = 1; n <= 10; n++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'scale-num-btn' + (currentReportScores[item.key] === n ? ' active' : '');
                btn.textContent = String(n);
                btn.addEventListener('click', () => {
                    currentReportScores[item.key] = n;
                    renderCriteriaControls();
                    updateLiveHealthScore();
                });
                grid.appendChild(btn);
            }

            block.appendChild(grid);
            container.appendChild(block);
        });
    }

    function updateLiveHealthScore() {
        const el = document.getElementById('liveHealthScore');
        if (el) {
            el.textContent = `${computeHealthScore()} /100`;
        }
    }

    document.querySelectorAll('.state-four-grid').forEach(grid => {
        const key = grid.dataset.statekey;
        grid.querySelectorAll('.state-opt-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.val === currentReportStates[key]);
            btn.addEventListener('click', () => {
                currentReportStates[key] = btn.dataset.val;
                grid.querySelectorAll('.state-opt-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    renderCriteriaControls();
    updateLiveHealthScore();

    function openDigitalReportForOrder(order) {
        activeMissionOrderId = order.id;
        document.getElementById('techActiveMissionCard')?.classList.add('hidden');
        const reportCard = document.getElementById('techDigitalReportCard');
        reportCard?.classList.remove('hidden');

        document.getElementById('reportTargetCarTitle').textContent = `${order.serviceLabel} - ${order.carFull} (${order.id})`;
        if (order.digitalReport) {
            currentReportScores = { ...order.digitalReport.scores };
            currentReportStates = { ...order.digitalReport.states };
            document.getElementById('techRecommendationsInput').value = order.digitalReport.recommendations || '';
            document.getElementById('techNotesInput').value = order.digitalReport.notes || '';
        } else {
            document.getElementById('techRecommendationsInput').value = '';
            document.getElementById('techNotesInput').value = '';
        }
        renderCriteriaControls();
        updateLiveHealthScore();
        reportCard?.scrollIntoView({ behavior: 'smooth' });
    }

    function closeDigitalReportCard() {
        document.getElementById('techDigitalReportCard')?.classList.add('hidden');
        const order = getOrderById(activeMissionOrderId);
        if (order) renderTechMissionPanel(order);
    }

    document.getElementById('closeDigitalReportBtn')?.addEventListener('click', closeDigitalReportCard);
    document.getElementById('cancelDigitalReportBtn')?.addEventListener('click', closeDigitalReportCard);

    document.getElementById('submitDigitalReportBtn')?.addEventListener('click', () => {
        const order = getOrderById(activeMissionOrderId);
        if (!order) return;

        order.digitalReport = {
            healthScore: computeHealthScore(),
            scores: { ...currentReportScores },
            states: { ...currentReportStates },
            recommendations: document.getElementById('techRecommendationsInput').value.trim(),
            notes: document.getElementById('techNotesInput').value.trim() || 'تم الفحص الشامل وإصدار التقرير الرقمي'
        };
        order.status = 'مكتمل';

        document.getElementById('techDigitalReportCard')?.classList.add('hidden');
        renderAllOrderViews();
        renderReportViewer(order);
        if (selectedOrderId === order.id) renderTrackingOrderDetails(order);
    });

    const techPinInput = document.getElementById('techPinInput');
    const techPinLoginBtn = document.getElementById('techPinLoginBtn');
    const techPinError = document.getElementById('techPinError');
    const techPinLockCard = document.getElementById('techPinLockCard');
    const techWorkspaceContent = document.getElementById('techWorkspaceContent');

    techPinLoginBtn?.addEventListener('click', () => {
        const pin = (techPinInput?.value || '').trim();
        const techName = TECHNICIANS_BY_PIN[pin];
        if (techName) {
            activeTechnician = { pin, name: techName };
            techPinError?.classList.add('hidden');
            techPinLockCard?.classList.add('hidden');
            techWorkspaceContent?.classList.remove('hidden');
            document.getElementById('techActiveName').textContent = techName;
            document.getElementById('techPinBadge').textContent = `بوابة التقني المعتمد • ${techName}`;
            if (techPinInput) techPinInput.value = '';
            renderTechRadarAndTasks();
        } else {
            techPinError?.classList.remove('hidden');
        }
    });

    document.getElementById('techLogoutBtn')?.addEventListener('click', () => {
        activeTechnician = null;
        techWorkspaceContent?.classList.add('hidden');
        techPinLockCard?.classList.remove('hidden');
        if (techPinInput) techPinInput.value = '';
    });

    function renderAdminStats() {
        const total = orders.length;
        const activeCount = orders.filter(o => o.status !== 'مكتمل').length;
        const completedOrders = orders.filter(o => o.status === 'مكتمل');
        const completedRevenue = completedOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
        const commission = Math.round(completedRevenue * 0.2);
        const workshopNet = completedRevenue - commission;

        document.getElementById('adminTotalOrders').textContent = String(total);
        document.getElementById('adminActiveOrdersText').textContent = `${activeCount} نشطة`;
        document.getElementById('adminCompletedRevenue').textContent = `DH ${completedRevenue}`;
        document.getElementById('adminCompletedCountText').textContent = `${completedOrders.length} خدمة مكتملة`;
        document.getElementById('adminCommissionAmount').textContent = `DH ${commission}`;
        document.getElementById('adminWorkshopNet').textContent = `DH ${workshopNet}`;

        const avgRating = ratingsList.length
            ? (ratingsList.reduce((a, b) => a + b, 0) / ratingsList.length).toFixed(1)
            : '5.0';

        document.getElementById('adminAvgRating').textContent = avgRating;
        document.getElementById('adminRatingCountText').textContent = ratingsList.length
            ? `من 5 نجوم (${ratingsList.length} تقييم)`
            : 'من 5 نجوم';

        document.getElementById('adminTechRatingSummary').textContent = `${avgRating} من 5 - ${ratingsList.length} تقييم`;
        document.getElementById('adminTechTasksBadge').textContent = `${total} مهمة`;

        const adminOrdersRows = document.getElementById('adminOrdersRows');
        const filteredOrders = currentAdminFilter === 'الكل'
            ? orders
            : orders.filter(o => o.status === currentAdminFilter);

        if (!filteredOrders.length) {
            adminOrdersRows.innerHTML = '<p class="admin-empty-msg">لا توجد طلبات مسجلة بعد.</p>';
        } else {
            adminOrdersRows.innerHTML = '';
            filteredOrders.forEach(order => {
                const row = document.createElement('div');
                row.className = 'admin-order-row';
                row.innerHTML = `
                    <div class="admin-order-top">
                        <strong>${order.carFull} (${order.fuel}) &bull; ${order.id}</strong>
                        <span class="order-item-badge">${order.status}</span>
                    </div>
                    <div class="order-item-sub">العميل: ${order.clientInfo} &bull; الفني: ${order.assignedTech || 'بانتظار القبول'} &bull; الموقع: ${order.locationFull} &bull; DH ${order.amount}</div>
                `;
                adminOrdersRows.appendChild(row);
            });
        }

        const warrantiesContainer = document.getElementById('adminWarrantiesContainer');
        const issuedReports = orders.filter(o => o.digitalReport);
        if (!issuedReports.length) {
            warrantiesContainer.innerHTML = '<p class="admin-empty-msg">لم تُصدر شهادات ضمان بعد.</p>';
        } else {
            warrantiesContainer.innerHTML = '';
            issuedReports.forEach(o => {
                const item = document.createElement('div');
                item.className = 'status-box';
                item.innerHTML = `
                    <div class="status-row"><span>السيارة:</span><strong>${o.carFull} (${o.id})</strong></div>
                    <div class="status-row"><span>مؤشر الصحة:</span><strong class="neon-highlight">${o.digitalReport.healthScore} / 100</strong></div>
                    <div class="status-row"><span>الحالة العامة:</span><strong>خارجية: ${o.digitalReport.states.exterior} | ميكانيكية: ${o.digitalReport.states.mechanical}</strong></div>
                    <div class="status-row"><span>ملاحظات الفني:</span><strong>${o.digitalReport.notes}</strong></div>
                `;
                warrantiesContainer.appendChild(item);
            });
        }
    }

    renderAllOrderViews();

    document.getElementById('emptyFirstBookingBtn')?.addEventListener('click', () => {
        resetBookingFormToStep1();
        switchCamiloinTab('booking');
    });

    document.getElementById('reportFirstBookingBtn')?.addEventListener('click', () => {
        resetBookingFormToStep1();
        switchCamiloinTab('booking');
    });

    document.getElementById('goToOrderReportBtn')?.addEventListener('click', () => {
        const order = getOrderById(selectedOrderId) || orders[0];
        if (order) renderReportViewer(order);
        switchCamiloinTab('report');
    });

    document.getElementById('searchOrderBtn')?.addEventListener('click', () => {
        const q = (document.getElementById('trackSearchInput')?.value || '').trim().toLowerCase();
        const msg = document.getElementById('searchOrderMsg');
        if (!q) {
            msg.textContent = 'المرجو إدخال رقم الطلب للبحث.';
            msg.classList.remove('hidden');
            return;
        }
        const found = orders.find(o => o.id.toLowerCase().includes(q));
        if (found) {
            msg.textContent = `تم العثور على الطلب: ${found.id}`;
            msg.classList.remove('hidden');
            renderTrackingOrderDetails(found);
        } else {
            msg.textContent = 'لا يوجد طلب بهذا الرقم في هذا المتصفح بعد.';
            msg.classList.remove('hidden');
        }
    });

    document.getElementById('searchReportBtn')?.addEventListener('click', () => {
        const q = (document.getElementById('reportSearchInput')?.value || '').trim().toLowerCase();
        if (!q) return;
        const found = orders.find(o => o.id.toLowerCase().includes(q));
        if (found) renderReportViewer(found);
    });

    // منطق الحجز
    let bookingMode = 'inspect';
    let selectedFuel = 'ديزل (مازوط)';
    let selectedPackage = 'Basic — DH 200 (فحص شامل للمحرك والهيكل وأجهزة الكشف)';
    let selectedAmount = 200;
    let gpsCoords = '';
    let carPhotoDataUrl = '';
    let lastCreatedOrder = null;

    const bookingForm = document.getElementById('bookingForm');
    const orderConfirmedCard = document.getElementById('orderConfirmedCard');
    const modeInspectBtn = document.getElementById('modeInspectBtn');
    const modeRepairBtn = document.getElementById('modeRepairBtn');
    const bookingMainTitle = document.getElementById('bookingMainTitle');
    const bookingMainDesc = document.getElementById('bookingMainDesc');
    const faultDescriptionGroup = document.getElementById('faultDescriptionGroup');
    const packageSelectGroup = document.getElementById('packageSelectGroup');
    const submitBookingBtn = document.getElementById('submitBookingBtn');
    const wlabel3 = document.getElementById('wlabel-3');
    const photoErrorMsg = document.getElementById('photoErrorMsg');

    function resetBookingFormToStep1() {
        orderConfirmedCard?.classList.add('hidden');
        bookingForm?.classList.remove('hidden');
        goToWizardStep(1);
    }

    function setBookingMode(mode) {
        bookingMode = mode;
        if (mode === 'inspect') {
            modeInspectBtn.classList.add('active');
            modeRepairBtn.classList.remove('active');
            bookingMainTitle.textContent = 'طلب فحص سيارة مستعملة';
            bookingMainDesc.textContent = 'اختر الماركة والموديل والباقة، وسيصلك فني معتمد لإجراء الفحص الكامل في موقعك.';
            faultDescriptionGroup.classList.add('hidden-field');
            packageSelectGroup.classList.remove('hidden-field');
            if (wlabel3) wlabel3.textContent = '3. الباقة والتواصل';
            submitBookingBtn.textContent = 'أرسل طلب الفحص';
        } else {
            modeRepairBtn.classList.add('active');
            modeInspectBtn.classList.remove('active');
            bookingMainTitle.textContent = 'طلب إصلاح سيارة';
            bookingMainDesc.textContent = 'صف العطل وحدد موقعك، وسيتواصل معك فني معتمد مع أقرب ورشة شريكة.';
            faultDescriptionGroup.classList.remove('hidden-field');
            packageSelectGroup.classList.add('hidden-field');
            if (wlabel3) wlabel3.textContent = '3. معلومات التواصل';
            submitBookingBtn.textContent = 'أرسل طلب الإصلاح';
            selectedAmount = 250;
        }
        goToWizardStep(1);
    }

    modeInspectBtn?.addEventListener('click', () => setBookingMode('inspect'));
    modeRepairBtn?.addEventListener('click', () => setBookingMode('repair'));

    document.getElementById('quickBookInspection')?.addEventListener('click', () => {
        setBookingMode('inspect');
        resetBookingFormToStep1();
        switchCamiloinTab('booking');
    });

    document.getElementById('cardInspectBtn')?.addEventListener('click', () => {
        setBookingMode('inspect');
        resetBookingFormToStep1();
        switchCamiloinTab('booking');
    });

    document.getElementById('quickBookRepair')?.addEventListener('click', () => {
        setBookingMode('repair');
        resetBookingFormToStep1();
        switchCamiloinTab('booking');
    });

    document.getElementById('cardRepairBtn')?.addEventListener('click', () => {
        setBookingMode('repair');
        resetBookingFormToStep1();
        switchCamiloinTab('booking');
    });

    // منطق شاشة SOS التفاعلية وتفعيل الزر وإرسال الطلب
    const sosFullNameInput = document.getElementById('sosFullNameInput');
    const sosPhoneInput = document.getElementById('sosPhoneInput');
    const sosDistrictSelect = document.getElementById('sosDistrictSelect');
    const sosDispatchBtn = document.getElementById('sosDispatchBtn');
    const sosHelperStatus = document.getElementById('sosHelperStatus');
    const sosGeoNotice = document.getElementById('sosGeoNotice');

    function syncSosButtonState() {
        const nameOk = (sosFullNameInput?.value || '').trim().length >= 2;
        const phoneOk = (sosPhoneInput?.value || '').trim().length >= 8;
        const ready = nameOk && phoneOk;
        if (sosDispatchBtn) sosDispatchBtn.disabled = !ready;
        if (sosHelperStatus) {
            sosHelperStatus.textContent = ready
                ? 'سيتم تحديد موقعك تلقائياً عند الضغط على الزر'
                : 'أدخل اسمك ورقم هاتفك لتفعيل زر الإغاثة';
        }
    }

    sosFullNameInput?.addEventListener('input', syncSosButtonState);
    sosPhoneInput?.addEventListener('input', syncSosButtonState);

    function openSosScreen() {
        syncSosButtonState();
        switchCamiloinTab('sos');
    }

    document.getElementById('quickSosBtn')?.addEventListener('click', openSosScreen);
    document.getElementById('cardSosBtn')?.addEventListener('click', openSosScreen);

    function createSosOrderRecord(locationText) {
        const clientName = (sosFullNameInput?.value || '').trim() || userDisplay.textContent;
        const clientPhone = (sosPhoneInput?.value || '').trim() || '0600000000';
        const sosOrder = {
            id: generateShortOrderCode(),
            serviceLabel: 'إغاثة طارئة (SOS)',
            carFull: 'سيارة في حالة طوارئ',
            fuel: selectedFuel,
            detail: 'إغاثة فورية على الطريق 24/7',
            amount: 200,
            locationFull: locationText,
            clientName: clientName,
            clientInfo: `${clientName} (${clientPhone})`,
            status: 'بانتظار فني',
            assignedTech: '',
            photoDataUrl: carPhotoDataUrl || '',
            digitalReport: null
        };
        orders.unshift(sosOrder);
        renderAllOrderViews();
        renderTrackingOrderDetails(sosOrder);
        switchCamiloinTab('tracking');
    }

    sosDispatchBtn?.addEventListener('click', () => {
        const chosenDistrict = (sosDistrictSelect?.value || '').trim() || 'الدار البيضاء';
        if (!navigator.geolocation) {
            sosGeoNotice?.classList.remove('hidden');
            createSosOrderRecord(chosenDistrict);
            return;
        }
        if (sosHelperStatus) sosHelperStatus.textContent = 'جاري تحديد موقعك تلقائياً...';
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(5);
                const lng = pos.coords.longitude.toFixed(5);
                sosGeoNotice?.classList.add('hidden');
                createSosOrderRecord(`${chosenDistrict} - GPS (${lat}, ${lng})`);
            },
            () => {
                sosGeoNotice?.classList.remove('hidden');
                createSosOrderRecord(chosenDistrict);
            }
        );
    });

    function goToWizardStep(stepNum) {
        document.querySelectorAll('.wizard-pane').forEach(p => p.classList.remove('active'));
        document.getElementById('wpane-' + stepNum)?.classList.add('active');

        document.querySelectorAll('.w-step').forEach(s => {
            s.classList.toggle('active', Number(s.dataset.wstep) <= stepNum);
        });
    }

    document.getElementById('nextToStep2Btn')?.addEventListener('click', () => {
        const brand = document.getElementById('carBrandSelect').value;
        const model = document.getElementById('carModelInput').value.trim();
        if (!brand || !model) {
            alert('يرجى اختيار ماركة السيارة وكتابة الموديل أولاً.');
            return;
        }
        goToWizardStep(2);
    });

    document.getElementById('backToStep1Btn')?.addEventListener('click', () => goToWizardStep(1));
    document.getElementById('nextToStep3Btn')?.addEventListener('click', () => goToWizardStep(3));
    document.getElementById('backToStep2Btn')?.addEventListener('click', () => goToWizardStep(2));

    document.querySelectorAll('.fuel-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.fuel-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedFuel = card.dataset.fuel;
        });
    });

    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedPackage = card.dataset.pkg;
            selectedAmount = Number(card.dataset.amount || 200);
        });
    });

    const carPhotoInput = document.getElementById('carPhotoInput');
    const pickCarPhotoBtn = document.getElementById('pickCarPhotoBtn');
    const carPhotoBtnText = document.getElementById('carPhotoBtnText');
    const carPhotoPreviewBox = document.getElementById('carPhotoPreviewBox');
    const carPhotoPreviewImg = document.getElementById('carPhotoPreviewImg');
    const carPhotoFileName = document.getElementById('carPhotoFileName');

    pickCarPhotoBtn?.addEventListener('click', () => {
        carPhotoInput?.click();
    });

    carPhotoInput?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            carPhotoDataUrl = ev.target.result;
            carPhotoPreviewImg.src = carPhotoDataUrl;
            carPhotoFileName.textContent = file.name;
            carPhotoPreviewBox.classList.remove('hidden');
            pickCarPhotoBtn.classList.add('selected');
            carPhotoBtnText.textContent = 'تغيير صورة السيارة';
            photoErrorMsg?.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    });

    const detectGpsBtn = document.getElementById('detectGpsBtn');
    const gpsBtnText = document.getElementById('gpsBtnText');

    detectGpsBtn?.addEventListener('click', () => {
        if (!navigator.geolocation) {
            gpsBtnText.textContent = 'المتصفح لا يدعم GPS';
            return;
        }
        gpsBtnText.textContent = 'جاري تحديد موقعك بدقة...';
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(5);
                const lng = pos.coords.longitude.toFixed(5);
                gpsCoords = `GPS (${lat}, ${lng})`;
                gpsBtnText.textContent = `تم تحديد الموقع: ${lat}, ${lng}`;
            },
            () => {
                gpsCoords = 'الدار البيضاء (GPS مفعّل)';
                gpsBtnText.textContent = 'تم تفعيل موقع الدار البيضاء التقريبي';
            }
        );
    });

    bookingForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!carPhotoDataUrl) {
            photoErrorMsg?.classList.remove('hidden');
            pickCarPhotoBtn?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const brand = document.getElementById('carBrandSelect').value;
        const model = document.getElementById('carModelInput').value.trim();
        const district = document.getElementById('casaDistrictSelect').value || 'الدار البيضاء';
        const fault = document.getElementById('faultDescInput').value.trim();
        const clientName = document.getElementById('clientFullNameInput').value.trim();
        const clientPhone = document.getElementById('clientPhoneInput').value.trim();

        const amountToUse = bookingMode === 'inspect' ? selectedAmount : 250;

        const newOrder = {
            id: generateShortOrderCode(),
            serviceLabel: bookingMode === 'inspect' ? 'فحص سيارة مستعملة' : 'إصلاح سيارة',
            carFull: `${brand} ${model}`,
            fuel: selectedFuel,
            detail: bookingMode === 'inspect' ? selectedPackage : (fault || 'إصلاح ميداني شامل'),
            amount: amountToUse,
            locationFull: gpsCoords ? `${district} - ${gpsCoords}` : district,
            clientName: clientName,
            clientInfo: `${clientName} (${clientPhone})`,
            status: 'بانتظار فني',
            assignedTech: '',
            photoDataUrl: carPhotoDataUrl,
            digitalReport: null
        };

        orders.unshift(newOrder);
        lastCreatedOrder = newOrder;
        renderAllOrderViews();

        bookingForm.classList.add('hidden');
        orderConfirmedCard?.classList.remove('hidden');
        document.getElementById('confirmedTitle').textContent = bookingMode === 'inspect' ? 'تم استلام طلب الفحص' : 'تم استلام طلب الإصلاح';
        document.getElementById('confirmedOrderId').textContent = newOrder.id;
    });

    document.getElementById('goTrackConfirmedBtn')?.addEventListener('click', () => {
        if (lastCreatedOrder) renderTrackingOrderDetails(lastCreatedOrder);
        switchCamiloinTab('tracking');
    });

    document.getElementById('createNewOrderBtn')?.addEventListener('click', () => {
        document.getElementById('carModelInput').value = '';
        document.getElementById('clientFullNameInput').value = '';
        document.getElementById('clientPhoneInput').value = '';
        carPhotoDataUrl = '';
        carPhotoPreviewBox?.classList.add('hidden');
        pickCarPhotoBtn?.classList.remove('selected');
        carPhotoBtnText.textContent = 'أرسل صورة السيارة';
        resetBookingFormToStep1();
    });

    const starBtns = document.querySelectorAll('.star-btn');
    const ratingFeedback = document.getElementById('ratingFeedback');

    starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedStars = Number(btn.dataset.val);
            starBtns.forEach(b => {
                b.classList.toggle('active', Number(b.dataset.val) <= selectedStars);
            });
            if (ratingFeedback) {
                ratingFeedback.textContent = `التقييم المختار: ${selectedStars} / 5 نجوم`;
            }
        });
    });

    document.getElementById('sendRatingBtn')?.addEventListener('click', () => {
        ratingsList.push(selectedStars);
        if (ratingFeedback) {
            ratingFeedback.textContent = `تم إرسال تقييمك (${selectedStars} نجوم) إلى لوحة الإدارة بنجاح.`;
        }
        renderAdminStats();
    });

    const adminPassInput = document.getElementById('adminPassInput');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminAuthError = document.getElementById('adminAuthError');
    const adminLockCard = document.getElementById('adminLockCard');
    const adminDashboardContent = document.getElementById('adminDashboardContent');

    adminLoginBtn?.addEventListener('click', () => {
        if ((adminPassInput?.value || '').trim() === '2027') {
            adminAuthError?.classList.add('hidden');
            adminLockCard.classList.add('hidden');
            adminDashboardContent.classList.remove('hidden');
            if (adminPassInput) adminPassInput.value = '';
            renderAdminStats();
        } else {
            adminAuthError?.classList.remove('hidden');
        }
    });

    document.getElementById('adminLockBtn')?.addEventListener('click', () => {
        adminDashboardContent.classList.add('hidden');
        adminLockCard.classList.remove('hidden');
        if (adminPassInput) adminPassInput.value = '';
    });

    document.getElementById('adminRefreshBtn')?.addEventListener('click', () => {
        renderAdminStats();
    });

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const targetId = 'admin-sub-' + btn.dataset.admintab;
            document.querySelectorAll('.admin-sub-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === targetId);
            });
        });
    });

    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentAdminFilter = chip.dataset.filter;
            renderAdminStats();
        });
    });
});