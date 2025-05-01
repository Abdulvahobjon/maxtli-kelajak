// Telefon raqamni formatlash uchun funksiya
function formatPhoneNumber(value) {
  if (!value) return '';

  // Faqat raqamlar va '+' belgisini qoldirish
  let phoneNumber = value.replace(/[^\d+]/g, '');

  // Agar '+' belgi yo'q bo'lsa, qo'shish
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = '+' + phoneNumber;
  }

  // Agar '+998' bilan boshlanmasa, '+998' ga o'zgartirish
  if (!phoneNumber.startsWith('+998')) {
    phoneNumber = '+998' + phoneNumber.substring(1);
  }

  // Formatini qo'llash: +998 XX XXX XX XX
  if (phoneNumber.length > 4) {
    let formatted = '+998 ';
    const afterCode = phoneNumber.substring(4);

    // Operator kodi (2 raqam)
    if (afterCode.length > 0) {
      formatted += afterCode.substring(0, 2);

      // Birinchi qism (3 raqam)
      if (afterCode.length > 2) {
        formatted += ' ' + afterCode.substring(2, 5);

        // Ikkinchi qism (2 raqam)
        if (afterCode.length > 5) {
          formatted += ' ' + afterCode.substring(5, 7);

          // Uchinchi qism (2 raqam)
          if (afterCode.length > 7) {
            formatted += ' ' + afterCode.substring(7, 9);
          }
        }
      }
    }
    return formatted;
  }

  return phoneNumber;
}

// Telefon raqamni tekshirish uchun funksiya
function validatePhoneNumber(phone) {
  const digitsOnly = phone.replace(/[^\d+]/g, '');
  return digitsOnly.length === 13 && digitsOnly.startsWith('+998');
}

// Ismni tekshirish uchun funksiya
function validateName(name) {
  return name.trim().length >= 2;
}

// Modalni ochish
function openModal() {
  const modal = document.getElementById("modal");
  const phoneInput = document.getElementById("phoneInput");
  modal.classList.remove("hidden");

  // Telefon raqam uchun default qiymat
  if (!phoneInput.value || phoneInput.value === "") {
    phoneInput.value = "+998";
  }

  // Fokusni ism inputiga qo'yish
  setTimeout(() => document.getElementById("nameInput").focus(), 100);
}

// Modalni yopish
function closeModal() {
  const modal = document.getElementById("modal");
  const form = document.getElementById("register-form");
  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");

  modal.classList.add("hidden");
  form.reset();
  nameError.textContent = "";
  phoneError.textContent = "";
  nameInput.classList.remove('error');
  phoneInput.classList.remove('error');
  phoneInput.value = "+998";
}

// Forma yuborilganda
document.getElementById("register-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");

  // Xatolarni tozalash
  nameError.textContent = "";
  phoneError.textContent = "";
  nameInput.classList.remove('error');
  phoneInput.classList.remove('error');

  let hasError = false;

  // Ismni tekshirish
  if (!validateName(nameInput.value)) {
    nameError.textContent = "Ism kamida 2 ta belgi bo'lishi kerak";
    nameInput.classList.add('error');
    nameInput.focus();
    hasError = true;
  }

  // Telefon raqamni tekshirish
  if (!validatePhoneNumber(phoneInput.value)) {
    phoneError.textContent = "To'g'ri telefon raqam kiriting: +998 XX XXX XX XX";
    phoneInput.classList.add('error');
    if (!hasError) phoneInput.focus();
    hasError = true;
  }

  if (hasError) return;

  // Forma ma'lumotlarni yuborish
  const formData = new FormData(this);

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwr7ggY_5aTRjH0HZ0x452krCZkEMP3kS6PSx5o1l3KTlxBqTFh5FmWCVFzr-6dHMqVXg/exec",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      // Meta Pixel Lead eventi
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
      }

      // Telegram kanaliga yo'naltirish
      window.location.href = "https://t.me/+TTQZ6PeEB-05ZTIy";

      // Modalni yopish va formani tozalash
      closeModal();
    } else {
      console.error("Server xatosi:", response.status);
      phoneError.textContent = "Ma'lumotlarni yuborishda xato yuz berdi. Iltimos, qayta urinib ko'ring.";
    }
  } catch (error) {
    console.error("Xato:", error);
    phoneError.textContent = "Ma'lumotlarni yuborishda xato yuz berdi. Iltimos, qayta urinib ko'ring.";
  }
});

// Telefon raqam kiritishda formatlash
document.getElementById("phoneInput").addEventListener("input", function(e) {
  const initialPosition = this.selectionStart;
  const initialLength = this.value.length;
  const formattedValue = formatPhoneNumber(this.value);

  if (formattedValue !== this.value) {
    this.value = formattedValue;
    const newLength = this.value.length;
    const positionDiff = newLength - initialLength;
    if (initialPosition + positionDiff > 0) {
      this.setSelectionRange(initialPosition + positionDiff, initialPosition + positionDiff);
    }
  }

  if (validatePhoneNumber(this.value)) {
    document.getElementById("phoneError").textContent = "";
    this.classList.remove('error');
  }
});

// Ism kiritishda validatsiya
document.getElementById("nameInput").addEventListener("input", function() {
  if (validateName(this.value)) {
    document.getElementById("nameError").textContent = "";
    this.classList.remove('error');
  }
});

// Modal tashqarisini bosganda yopish
document.getElementById("modal").addEventListener("click", function(e) {
  if (e.target === this) closeModal();
});

// Escape tugmasi bilan modalni yopish
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && !document.getElementById("modal").classList.contains("hidden")) {
    closeModal();
  }
});

// Sayt yuklanganda telefon raqam uchun default qiymat
document.addEventListener("DOMContentLoaded", function() {
  const phoneInput = document.getElementById("phoneInput");
  if (!phoneInput.value || phoneInput.value === "") {
    phoneInput.value = "+998";
  }
});