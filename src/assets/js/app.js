import MobileMenu from 'mmenu-light';
import Swal from 'sweetalert2';
import Anime from './partials/anime';
import initTootTip from './partials/tooltip';
import AppHelpers from "./app-helpers";
import './store-locations';
import './luxury-reward'
import './brand-video'
import './categories'
import './all-products'
import './categorie'

class App extends AppHelpers {
  constructor() {
    super();
    window.app = this;
  }

  loadTheApp() {
    this.commonThings();
    this.initiateNotifier();
    this.initiateMobileMenu();
    if (header_is_sticky) {
      this.initiateStickyMenu();
    }
    this.initAddToCart();
    this.initiateDropdowns();
    this.initiateModals();
    this.initiateCollapse();
    
    // تفعيل الأنيميشن، العداد التنازلي، وتبويبات المنتجات المميزة
    this.initiateRevealSections();
    this.initiateCountdown(); 
    this.initiateFeaturedTabs(); // <--- تم إضافة استدعاء التبويبات هنا!
    
    // Ensure #more-menu-dropdown exists before running changeMenuDirection
    const menuDirInterval = setInterval(() => {
      if (document.querySelector('#more-menu-dropdown')) {
        this.changeMenuDirection();
        clearInterval(menuDirInterval);
      }
    }, 100);

    initTootTip();
    this.loadModalImgOnclick();

    salla.comment.event.onAdded(() => window.location.reload());

    this.status = 'ready';
    document.dispatchEvent(new CustomEvent('theme::ready'));
    this.log('Theme Loaded 🎉');
  }

  log(message) {
    salla.log(`ThemeApp(Raed)::${message}`);
    return this;
  }

  /**
   * دالة الأنيميشن لمراقبة التمرير وإظهار الأقسام بسلاسة
   */
  initiateRevealSections() {
    const revealSections = document.querySelectorAll('.reveal-section');
    if (!revealSections.length) return;

    const triggerReveal = () => {
      // حساب المسافة المناسبة في الشاشة لبدء الحركة (4/5 الشاشة)
      const triggerBottom = (window.innerHeight / 5) * 4;

      revealSections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop < triggerBottom) {
          section.classList.add('show');
        }
      });
    };

    // تشغيل الدالة فوراً للتأكد من إظهار الأقسام الظاهرة سلفاً في أعلى الصفحة
    triggerReveal();
    window.addEventListener('scroll', triggerReveal, { passive: true });
  }

  /**
   * تشغيل العداد التنازلي الفعلي ثانية بثانية
   */
  initiateCountdown() {
    const timerContainer = document.querySelector('.offer-timer');
    if (!timerContainer) return;

    const targetDateStr = timerContainer.getAttribute('data-countdown');
    if (!targetDateStr) return;

    const targetDate = new Date(targetDateStr).getTime();

    const daysEl = timerContainer.querySelector('.days');
    const hoursEl = timerContainer.querySelector('.hours');
    const minutesEl = timerContainer.querySelector('.minutes');
    const secondsEl = timerContainer.querySelector('.seconds');

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        clearInterval(intervalId);
        if (daysEl) daysEl.innerText = "00";
        if (hoursEl) hoursEl.innerText = "00";
        if (minutesEl) minutesEl.innerText = "00";
        if (secondsEl) secondsEl.innerText = "00";
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
  }

  /**
   * دالة التحكم في تبويبات المنتجات المميزة (Featured Products Tabs)
   */
  initiateFeaturedTabs() {
    const tabButtons = document.querySelectorAll('.tab-trigger');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const sectionContainer = button.closest('.featured-products-section');
        if (!sectionContainer) return;

        // 1. إزالة الحالة النشطة عن جميع الأزرار داخل هذا القسم فقط
        sectionContainer.querySelectorAll('.tab-trigger').forEach(btn => {
          btn.classList.remove('is-active');
        });

        // 2. إخفاء جميع محتويات التبويبات داخل هذا القسم فقط
        sectionContainer.querySelectorAll('.tabs__item').forEach(content => {
          content.classList.remove('is-active');
        });

        // 3. تفعيل الزر الذي تم الضغط عليه
        button.classList.add('is-active');

        // 4. إظهار المحتوى التابع للزر المختار
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('is-active');
        }
      });
    });
  }

  changeMenuDirection() {
    setTimeout(() => {
      app.all('.root-level.has-children', item => {
        if (item.classList.contains('change-menu-dir')) return;
        app.on('mouseover', item, () => {
          let allSubMenus = item.querySelectorAll('.sub-menu');
          allSubMenus.forEach((submenu, idx) => {
            if (idx === 0) return;
            let rect = submenu.getBoundingClientRect();
            if (rect.left < 10 || rect.right > window.innerWidth - 10) {
              app.addClass(item, 'change-menu-dir');
            }
          });
        });
      });
    }, 1000);
  }

  loadModalImgOnclick(){
    document.querySelectorAll('.load-img-onclick').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        let modal = document.querySelector('#' + link.dataset.modalId),
          img = modal.querySelector('img'),
          imgSrc = img.dataset.src;
        modal.open();

        if (img.classList.contains('loaded')) return;

        img.src = imgSrc;
        img.classList.add('loaded');
      })
    })
  }

  commonThings() {
    this.cleanContentArticles('.content-entry');
  }

  cleanContentArticles(elementsSelector) {
    let articleElements = document.querySelectorAll(elementsSelector);

    if (articleElements.length) {
      articleElements.forEach(article => {
        article.innerHTML = article.innerHTML.replace(/\&nbsp;/g, ' ')
      })
    }
  }

  isElementLoaded(selector){
    return new Promise((resolve=>{
      const interval=setInterval(()=>{
      if(document.querySelector(selector)){
        clearInterval(interval)
        return resolve(document.querySelector(selector))
      }
     },160)
  }))
  };

  copyToClipboard(event) {
    event.preventDefault();
    let aux = document.createElement("input"),
    btn = event.currentTarget;
    aux.setAttribute("value", btn.dataset.content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toggleElementClassIf(btn, 'copied', 'code-to-copy', () => true);
    setTimeout(() => {
      this.toggleElementClassIf(btn, 'code-to-copy', 'copied', () => true)
    }, 1000);
  }

  initiateNotifier() {
    salla.notify.setNotifier(function (message, type, data) {
      if (window.enable_add_product_toast && data?.data?.googleTags?.event === "addToCart") {
        return;
      }
      if (typeof message == 'object') {
        return Swal.fire(message).then(type);
      }

      return Swal.mixin({
        toast: true,
        position: salla.config.get('theme.is_rtl') ? 'top-start' : 'top-end',
        showConfirmButton: false,
        timer: 2000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      }).fire({
        icon: type,
        title: message,
        showCloseButton: true,
        timerProgressBar: true
      })
    });
  }

  initiateMobileMenu() {
    this.isElementLoaded('#mobile-menu').then((menu) => {
      const mobileMenu = new MobileMenu(menu, "(max-width: 1024px)", "( slidingSubmenus: false)");

      salla.lang.onLoaded(() => {
        mobileMenu.navigation({ title: salla.lang.get('blocks.header.main_menu') });
      });
      const drawer = mobileMenu.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' });

      this.onClick("a[href='#mobile-menu']", event => {
        document.body.classList.add('menu-opened');
        event.preventDefault() || drawer.close() || drawer.open()
      });
      this.onClick(".close-mobile-menu", event => {
        document.body.classList.remove('menu-opened');
        event.preventDefault() || drawer.close()
      });
    });
  }

  initiateStickyMenu() {
    let header = this.element('#mainnav'),
      height = this.element('#mainnav .inner')?.clientHeight;
    //when it's landing page, there is no header
    if (!header) {
      return;
    }

    window.addEventListener('load', () => setTimeout(() => this.setHeaderHeight(), 500))
    window.addEventListener('resize', () => this.setHeaderHeight())

    window.addEventListener('scroll', () => {
      window.scrollY >= header.offsetTop + height ? header.classList.add('fixed-pinned', 'animated') : header.classList.remove('fixed-pinned');
      window.scrollY >= 200 ? header.classList.add('fixed-header') : header.classList.remove('fixed-header', 'animated');
    }, { passive: true });
  }

  setHeaderHeight() {
    let height = this.element('#mainnav .inner').clientHeight,
      header = this.element('#mainnav');
    header.style.height = height + 'px';
  }

  initiateDropdowns() {
    this.onClick('.dropdown__trigger', ({ target: btn }) => {
      btn.parentElement.classList.toggle('is-opened');
      document.body.classList.toggle('dropdown--is-opened');
      // Click Outside || Click on close btn
      window.addEventListener('click', ({ target: element }) => {
        if (!element.closest('.dropdown__menu') && element !== btn || element.classList.contains('dropdown__close')) {
          btn.parentElement.classList.remove('is-opened');
          document.body.classList.remove('dropdown--is-opened');
        }
      });
    });
  }

  initiateModals() {
    this.onClick('[data-modal-trigger]', e => {
      let id = '#' + e.target.dataset.modalTrigger;
      this.removeClass(id, 'hidden');
      setTimeout(() => this.toggleModal(id, true)); //small amont of time to running toggle After adding hidden
    });
    salla.event.document.onClick("[data-close-modal]", e => this.toggleModal('#' + e.target.dataset.closeModal, false));
  }

  toggleModal(id, isOpen) {
    this.toggleClassIf(`${id} .s-salla-modal-overlay`, 'ease-out duration-300 opacity-100', 'opacity-0', () => isOpen)
      .toggleClassIf(`${id} .s-salla-modal-body`,
        'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100', //add these classes
        'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', //remove these classes
        () => isOpen)
      .toggleElementClassIf(document.body, 'modal-is-open', 'modal-is-closed', () => isOpen);
    if (!isOpen) {
      setTimeout(() => this.addClass(id, 'hidden'), 350);
    }
  }

  initiateCollapse() {
    document.querySelectorAll('.btn--collapse')
      .forEach((trigger) => {
        const content = document.querySelector('#' + trigger.dataset.show);
        if (!content) return;

        const state = { isOpen: false }

        const toggleState = (isOpen) => {
          state.isOpen = !isOpen;
          this.toggleElementClassIf([content, trigger], 'is-closed', 'is-opened', () => isOpen);
        }

        trigger.addEventListener('click', () => {
          const { isOpen } = state;
          toggleState(isOpen);
        });
      });
  }

  anime(selector, options = null) {
    let anime = new Anime(selector, options);
    return options === false ? anime : anime.play();
  }

  initAddToCart() {
    salla.cart.event.onUpdated(summary => {
      document.querySelectorAll('[data-cart-total]').forEach(el => el.innerHTML = salla.money(summary.total));
      document.querySelectorAll('[data-cart-count]').forEach(el => el.innerText = salla.helpers.number(summary.count));
    });

    salla.cart.event.onItemAdded((response, prodId) => {
      app.element('salla-cart-summary').animateToCart(app.element(`#product-${prodId} img`));
    });
  }
}

salla.onReady(() => (new App).loadTheApp());