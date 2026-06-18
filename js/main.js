(function () {
    const IMAGE_BASE = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image';

    const buildingImages = {
        citang: {
            before: '破旧失修的清代祠堂古建筑，墙体斑驳，瓦片脱落，木构件腐朽，杂草丛生，沧桑破败感',
            after: '修复后精美的清代祠堂古建筑，朱红大门，青瓦白墙，木雕精美，彩绘贴金，庄严华丽，中式古建筑风格'
        },
        paifang: {
            before: '风化破损的古代石牌坊，石材表面斑驳，部分雕刻模糊，构件有裂纹，沧桑历史感',
            after: '修复后庄严的古代石牌坊，青石材质，雕刻精美，题额清晰，飞檐翘角，中式石牌坊建筑'
        },
        guqiao: {
            before: '破旧的古代石拱桥，桥面破损，栏杆缺失，桥体长满杂草，河水浑浊，沧桑破败',
            after: '修复后精美的古代石拱桥，青石砌筑，拱券优美，栏杆雕刻精致，河水清澈，古桥倒影，中式古桥风景'
        },
        xitai: {
            before: '破旧的清代古戏台，屋顶渗漏，木构件糟朽，彩绘褪色，斗拱变形，荒凉破败',
            after: '修复后华丽的清代古戏台，飞檐翘角，斗拱繁复，木雕精美，彩绘绚丽，戏台建筑，中式古建筑风格'
        }
    };

    function buildImageUrl(prompt, size) {
        const encoded = encodeURIComponent(prompt);
        return `${IMAGE_BASE}?prompt=${encoded}&image_size=${size || 'landscape_4_3'}`;
    }

    function initComparison(container) {
        const building = container.dataset.building;
        const beforeImg = container.querySelector('.compare-before');
        const afterImg = container.querySelector('.compare-after');
        const beforeWrapper = container.querySelector('.compare-before-wrapper');
        const slider = container.querySelector('.compare-slider');

        if (!buildingImages[building]) return;

        beforeImg.src = buildImageUrl(buildingImages[building].before);
        afterImg.src = buildImageUrl(buildingImages[building].after);

        let isDragging = false;

        function updateSlider(clientX) {
            const rect = container.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;

            beforeWrapper.style.width = percent + '%';
            slider.style.left = percent + '%';

            if (beforeImg) {
                beforeImg.style.width = (100 / (percent / 100)) + '%';
            }
        }

        function onStart(e) {
            isDragging = true;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(clientX);
        }

        function onMove(e) {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(clientX);
        }

        function onEnd() {
            isDragging = false;
        }

        container.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        container.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);

        container.addEventListener('click', function (e) {
            if (!isDragging) {
                updateSlider(e.clientX);
            }
        });

        function checkBothLoaded() {
            if (beforeImg.complete && afterImg.complete) {
                container.classList.add('loaded');
            }
        }

        beforeImg.addEventListener('load', checkBothLoaded);
        if (beforeImg.complete && afterImg.complete) {
            checkBothLoaded();
        }
    }

    function initRestorationPage() {
        const containers = document.querySelectorAll('.compare-container');
        containers.forEach(function (container) {
            initComparison(container);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRestorationPage);
    } else {
        initRestorationPage();
    }
})();
