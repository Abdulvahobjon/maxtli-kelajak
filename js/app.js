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
  // Faqat '+', raqamlar va bo'sh joylarni olib tashlaymiz
  const digitsOnly = phone.replace(/[^\d+]/g, '');
  
  // +998 dan keyin kamida 9 raqam bo'lishi kerak (jami uzunlik 13)
  return digitsOnly.length >= 13 && digitsOnly.startsWith('+998');
}

// Ismni tekshirish uchun funksiya
function validateName(name) {
  return name.trim().length >= 2;
}

// Forma yuborilganda tekshirish
document.getElementById("register-form").addEventListener("submit", function(e) {
  e.preventDefault(); // Standart yuborishni to'xtatish
  
  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  
  // Xatoliklarni tozalash
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
    if (!hasError) {
      phoneInput.focus();
    }
    hasError = true;
  }
  
  if (hasError) {
    return;
  }
  
  // Formani yuborish
  const form = document.getElementById("register-form");
  const formData = new FormData(form);
  
  // Telegram kanaliga yo'naltirish
  window.location = "https://t.me/+TTQZ6PeEB-05ZTIy";
  
  // Google Apps Script'ga yuborish
  fetch(
    "https://script.google.com/macros/s/AKfycbwr7ggY_5aTRjH0HZ0x452krCZkEMP3kS6PSx5o1l3KTlxBqTFh5FmWCVFzr-6dHMqVXg/exec",
    {
      method: "POST",
      body: formData,
    }
  )
  .then((response) => {
    closeModal(); // Modalni yopish
    form.reset(); // Formani tozalash
    // Default qiymatni qayta qo'yish
    document.getElementById("phoneInput").value = "+998";
  })
  .catch((error) => {
    console.error("Error:", error);
  });
});

// Telefon raqamda faqat raqamlarni kiritish va formatlash
document.getElementById("phoneInput").addEventListener("input", function(e) {
  const initialPosition = this.selectionStart;
  const initialLength = this.value.length;
  
  // Telefon raqamni formatlash
  const formattedValue = formatPhoneNumber(this.value);
  
  // Agar formatlangan qiymat hozirgi qiymatdan farq qilsa, yangilash
  if (formattedValue !== this.value) {
    // Kursorni to'g'ri joyga qo'yish uchun logika
    this.value = formattedValue;
    const newLength = this.value.length;
    const positionDiff = newLength - initialLength;
    
    // Kursorni yangi pozitsiyaga qo'yish
    if (initialPosition + positionDiff > 0) {
      this.setSelectionRange(initialPosition + positionDiff, initialPosition + positionDiff);
    }
  }
  
  // Xato xabarini tozalash
  if (validatePhoneNumber(this.value)) {
    document.getElementById("phoneError").textContent = "";
    this.classList.remove('error');
  }
});

// Ismni kiritish paytida validatsiyani ko'rsatish
document.getElementById("nameInput").addEventListener("input", function(e) {
  if (validateName(this.value)) {
    document.getElementById("nameError").textContent = "";
    this.classList.remove('error');
  }
});

// Modalni ochish
function openModal() {
  document.getElementById("modal").classList.remove("hidden");
  
  // Agar telefon raqam bo'sh bo'lsa, default qiymat qo'yish
  const phoneInput = document.getElementById("phoneInput");
  if (!phoneInput.value || phoneInput.value === "") {
    phoneInput.value = "+998";
  }
  
  // Forma fokusini birinchi inputga qo'yish
  setTimeout(() => {
    document.getElementById("nameInput").focus();
  }, 100);
}

// Modalni yopish
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  
  // Formani tozalash
  document.getElementById("register-form").reset();
  
  // Xatoliklarni tozalash
  document.getElementById("nameError").textContent = "";
  document.getElementById("phoneError").textContent = "";
  document.getElementById("nameInput").classList.remove('error');
  document.getElementById("phoneInput").classList.remove('error');
}

// Modal tashqarisini bosganda yopish
document.getElementById("modal").addEventListener("click", function(e) {
  if (e.target === this) {
    closeModal();
  }
});

// Escape tugmasini bosganda modalni yopish
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && !document.getElementById("modal").classList.contains("hidden")) {
    closeModal();
  }
});

// Sayt yuklanganda telefon raqamni default qiymatini qo'yish
document.addEventListener("DOMContentLoaded", function() {
  const phoneInput = document.getElementById("phoneInput");
  if (phoneInput && (!phoneInput.value || phoneInput.value === "")) {
    phoneInput.value = "+998";
  }
});