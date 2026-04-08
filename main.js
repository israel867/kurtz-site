/* ============================================
   Kurtz Auto Detailing — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile Menu Toggle ---------- */
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Mobile dropdown toggle
    var mobileDropdownBtn = mobileNav.querySelector('.mobile-nav__dropdown-btn');
    var mobileDropdownSub = mobileNav.querySelector('.mobile-nav__sub');
    if (mobileDropdownBtn && mobileDropdownSub) {
      mobileDropdownBtn.addEventListener('click', function () {
        var isOpen = mobileDropdownSub.style.display === 'block';
        mobileDropdownSub.style.display = isOpen ? 'none' : 'block';
        mobileDropdownBtn.setAttribute('aria-expanded', !isOpen);
      });
    }
  }

  /* ---------- Desktop Dropdown ---------- */
  var dropdown = document.querySelector('.navbar__dropdown');
  if (dropdown) {
    var toggle = dropdown.querySelector('.navbar__dropdown-toggle');
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }

  /* ---------- FAQ Accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-item__question');
    if (question) {
      question.addEventListener('click', function () {
        var isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(function (i) { i.classList.remove('active'); });
        // Open clicked if it was closed
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  /* ---------- Gallery Filter Tabs ---------- */
  var filterTabs = document.querySelectorAll('.filter-tab');
  var galleryItems = document.querySelectorAll('.gallery-item');

  if (filterTabs.length > 0) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var filter = tab.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Quote Form Submit ---------- */
  var quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = quoteForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      var formData = new FormData(quoteForm);
      var data = {};
      formData.forEach(function (value, key) {
        if (data[key]) {
          data[key] = data[key] + ', ' + value;
        } else {
          data[key] = value;
        }
      });
      fetch(quoteForm.action, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          var alert = document.querySelector('.form-alert--success');
          if (alert) {
            alert.style.display = 'block';
            alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          quoteForm.reset();
          btn.textContent = 'Sent!';
        } else {
          btn.textContent = 'Error — try again';
          btn.disabled = false;
        }
      }).catch(function () {
        btn.textContent = 'Error — try again';
        btn.disabled = false;
      });
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Navbar scroll shadow ---------- */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }

});
