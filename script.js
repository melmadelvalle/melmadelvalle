/**
 * Constructora Melma del Valle, S.A. de C.V.
 * Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // WhatsApp & Contact settings
  const WHATSAPP_NUMBER = '525545858072';
  const CONTACT_EMAIL = 'contacto@melmadelvalle.com';

  // 1. Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  // 2. Navbar Scroll Effect & Active Section Tracking
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active navigation highlight based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const handleScrollActiveLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', handleScrollActiveLink);

  // 3. Rubros Category Filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const rubroCards = document.querySelectorAll('.rubro-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active button style
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      rubroCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 4. Dynamic Subrubros in the Calculator
  const rubroData = {
    Construccion: [
      { id: 'Residencial', label: 'Residencial (Casas, departamentos, fraccionamientos)' },
      { id: 'Comercial', label: 'Comercial (Locales, naves, corporativos)' },
      { id: 'ObraPublica', label: 'Obra Pública (Infraestructura, áreas cívicas)' }
    ],
    Remodelacion: [
      { id: 'Exteriores', label: 'Exteriores (Fachadas, impermeabilización)' },
      { id: 'Interiores', label: 'Interiores (Redistribución, cocinas, baños)' }
    ],
    Acabados: [
      { id: 'Carpinteria', label: 'Carpintería fina y mobiliario' },
      { id: 'Pisos', label: 'Pisos (Porcelanatos, cerámicos, duela)' },
      { id: 'Cancelaria', label: 'Cancelería de aluminio y vidrio templado' },
      { id: 'Herreria', label: 'Herrería y estructuras metálicas' },
      { id: 'Plafones', label: 'Plafones y Tablaroca' },
      { id: 'Electricidad', label: 'Instalaciones eléctricas y luminarias' }
    ],
    Proyectos: [
      { id: 'Planos', label: 'Planos arquitectónicos, estructurales e instalaciones' },
      { id: 'Renders', label: 'Renders 3D fotorrealistas y recorridos virtuales' }
    ]
  };

  const rubroSelect = document.getElementById('calc-rubro');
  const subrubroSelect = document.getElementById('calc-subrubro');

  const updateSubrubros = (selectedCategory) => {
    subrubroSelect.innerHTML = '<option value="" disabled selected>Selecciona una opción...</option>';
    
    if (selectedCategory && rubroData[selectedCategory]) {
      rubroData[selectedCategory].forEach(item => {
        const option = document.createElement('option');
        option.value = item.label;
        option.textContent = item.label;
        subrubroSelect.appendChild(option);
      });
      subrubroSelect.disabled = false;
    } else {
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.textContent = 'Elige primero un rubro...';
      subrubroSelect.appendChild(defaultOption);
      subrubroSelect.disabled = true;
    }
  };

  if (rubroSelect && subrubroSelect) {
    rubroSelect.addEventListener('change', (e) => {
      updateSubrubros(e.target.value);
    });
  }

  // 5. Connect "Cotizar este rubro" buttons on cards to the Calculator
  const openCotizarButtons = document.querySelectorAll('.open-cotizar-btn');
  openCotizarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      const cotizadorEl = document.getElementById('cotizador');

      if (cotizadorEl) {
        cotizadorEl.scrollIntoView({ behavior: 'smooth' });

        // Map button name to select value
        let mapVal = '';
        if (serviceName === 'Construcción') mapVal = 'Construccion';
        else if (serviceName === 'Remodelación') mapVal = 'Remodelacion';
        else if (serviceName === 'Acabados') mapVal = 'Acabados';
        else if (serviceName === 'Proyectos') mapVal = 'Proyectos';

        if (mapVal && rubroSelect) {
          rubroSelect.value = mapVal;
          updateSubrubros(mapVal);
          setTimeout(() => {
            subrubroSelect.focus();
          }, 600);
        }
      }
    });
  });

  // 6. Handle Cotizador Form Submission (WhatsApp & Email)
  const calcForm = document.getElementById('calculator-form');
  const btnEmailQuote = document.getElementById('btn-email-quote');

  const compileQuoteData = () => {
    const rubro = rubroSelect ? rubroSelect.options[rubroSelect.selectedIndex]?.text : '';
    const subrubro = subrubroSelect ? subrubroSelect.value : '';
    const area = document.getElementById('calc-area')?.value || 'No especificado';
    const ubicacion = document.getElementById('calc-ubicacion')?.value || 'CDMX';
    const nombre = document.getElementById('calc-nombre')?.value || '';
    const telefono = document.getElementById('calc-telefono')?.value || '';
    const detalles = document.getElementById('calc-detalles')?.value || 'Ninguno';

    return { rubro, subrubro, area, ubicacion, nombre, telefono, detalles };
  };

  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = compileQuoteData();

      if (!data.nombre || !data.telefono || !data.subrubro) {
        alert('Por favor completa todos los campos requeridos (*).');
        return;
      }

      // WhatsApp message formatting
      const text = `¡Hola Constructora Melma del Valle!%0A%0A` +
        `Quisiera cotizar un proyecto con los siguientes datos:%0A` +
        `*Cliente:* ${encodeURIComponent(data.nombre)}%0A` +
        `*Teléfono:* ${encodeURIComponent(data.telefono)}%0A` +
        `*Rubro:* ${encodeURIComponent(data.rubro)}%0A` +
        `*Especialidad:* ${encodeURIComponent(data.subrubro)}%0A` +
        `*Metros Cuadrados (m²):* ${encodeURIComponent(data.area)} m²%0A` +
        `*Ubicación:* ${encodeURIComponent(data.ubicacion)}%0A` +
        `*Detalles Adicionales:* ${encodeURIComponent(data.detalles)}%0A%0A` +
        `_Enviado desde el cotizador web_`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
      window.open(waUrl, '_blank');
    });
  }

  if (btnEmailQuote) {
    btnEmailQuote.addEventListener('click', () => {
      const data = compileQuoteData();
      if (!data.nombre || !data.telefono) {
        alert('Por favor ingresa al menos tu nombre y teléfono para enviar por correo.');
        return;
      }

      const subject = encodeURIComponent(`Solicitud de Cotización: ${data.rubro || 'Proyecto General'} - ${data.nombre}`);
      const body = encodeURIComponent(
        `Hola Constructora Melma del Valle S.A. de C.V.,\n\n` +
        `Deseo solicitar información y presupuesto preliminar para el siguiente proyecto:\n\n` +
        `- Cliente: ${data.nombre}\n` +
        `- Teléfono de contacto: ${data.telefono}\n` +
        `- Rubro: ${data.rubro}\n` +
        `- Especialidad: ${data.subrubro}\n` +
        `- Área estimada: ${data.area} m²\n` +
        `- Ubicación: ${data.ubicacion}\n` +
        `- Detalles: ${data.detalles}\n\n` +
        `Quedo en espera de su respuesta.\nSaludos cordiales.`
      );

      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  // 7. General Contact Form
  const contactForm = document.getElementById('general-contact-form');
  const statusMsg = document.getElementById('contact-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const phone = document.getElementById('contact-phone').value;
      const service = document.getElementById('contact-service').value;
      const message = document.getElementById('contact-msg').value;

      // Format WhatsApp query as fallback direct contact
      const text = `Hola Constructora Melma del Valle,%0A%0A` +
        `Mi nombre es *${encodeURIComponent(name)}*%0A` +
        `Correo: ${encodeURIComponent(email)}%0A` +
        `Tel: ${encodeURIComponent(phone)}%0A` +
        `Servicio de interés: ${encodeURIComponent(service)}%0A` +
        `Mensaje: ${encodeURIComponent(message)}`;

      if (statusMsg) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.textContent = '¡Gracias por contactarnos! Te redirigiremos para confirmar tu mensaje.';
      }

      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
        contactForm.reset();
      }, 1200);
    });
  }
});
