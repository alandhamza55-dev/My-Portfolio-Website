const storageKey = "shifacare-real-hms";
const rate = 1500;

const emptyState = {
  patients: [],
  visits: [],
  sales: [],
  finance: [],
  purchases: [],
  audit: [],
  roles: { doctor: true, cashier: true, finance: true, admin: true },
  currency: "IQD",
  language: "en"
};

const clone = value => JSON.parse(JSON.stringify(value));
let state = loadState();

const helpText = {
  en: [
    "Patients: enter full medical history, allergy, blood group, and contact details.",
    "Visits: choose a registered patient, department, doctor, priority, and reason.",
    "POS: record medicine or goods sales. Receipts and income are calculated automatically.",
    "Finance: post income, expenses, and loans in IQD or USD. Reports update instantly."
  ],
  ku: [
    "نەخۆشەکان: مێژووی پزیشکی، هەستیاری، گروپی خوێن و ژمارەی پەیوەندی تۆمار بکە.",
    "سەردانەکان: نەخۆشی تۆمارکراو، بەش، پزیشک، گرنگی و هۆکاری سەردان هەڵبژێرە.",
    "POS: فرۆشتنی دەرمان و کاڵا تۆمار بکە. پسوڵە و داهات خۆکارانە ژمێردراون.",
    "دارایی: داهات، خەرجی و قەرز بە دینار یان دۆلار تۆمار بکە."
  ],
  ar: [
    "المرضى: أدخل التاريخ الطبي والحساسية وفصيلة الدم وبيانات الاتصال.",
    "الزيارات: اختر مريضا مسجلا والقسم والطبيب والأولوية وسبب الزيارة.",
    "نقطة البيع: سجل مبيعات الأدوية والمواد، ويتم حساب الإيصالات والدخل تلقائيا.",
    "المالية: سجل الإيرادات والمصاريف والقروض بالدينار أو الدولار."
  ]
};

const translations = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.patients": "Patients",
    "nav.visits": "Visits",
    "nav.pharmacy": "Pharmacy POS",
    "nav.finance": "Finance",
    "nav.purchases": "Purchases",
    "nav.reports": "Reports",
    "nav.security": "Authorities",
    "nav.archive": "Archive",
    "nav.help": "Help",
    "topbar.system": "Local browser system",
    "topbar.title": "Hospital Management System",
    "topbar.searchPlaceholder": "Search patients, visits, receipts, purchases...",
    "topbar.languageLabel": "Help language",
    "hero.status": "All data is entered by you and saved locally",
    "hero.title": "Manage real clinic workflows from one responsive front-end.",
    "hero.description": "Register patients, schedule visits, sell medicines, track expenses, manage loans, calculate profit, control authorities, and preserve an audit archive with localStorage.",
    "hero.addPatient": "Add patient",
    "hero.export": "Export JSON",
    "hero.clear": "Clear local data",
    "hero.imageAria": "Modern hospital corridor",
    "metrics.patients": "Patients",
    "metrics.visits": "Open visits",
    "metrics.sales": "POS sales",
    "metrics.profit": "Net profit",
    "metrics.registered": "registered",
    "metrics.queue": "active queue",
    "metrics.salesHint": "sales",
    "metrics.profitHint": "income - expenses",
    "section.medicalRecords": "Medical records",
    "section.patientRegistry": "Patient registry",
    "section.arrivals": "Arrivals",
    "section.visitQueue": "Visit queue",
    "section.expressSales": "Express sales",
    "section.pharmacyPos": "Pharmacy POS",
    "section.currentPosTotal": "Current POS total",
    "section.iqdUsd": "IQD / USD",
    "section.financeLedger": "Finance and loans ledger",
    "section.clinicStock": "Clinic stock",
    "section.purchaseRegister": "Purchase register",
    "section.reports": "Automatic reports",
    "section.expensesIncomeProfit": "Expenses, income, profit",
    "section.security": "Security",
    "section.authorities": "Authorities",
    "section.archive": "Permanent archive",
    "section.auditTrail": "Audit trail",
    "section.help": "Help",
    "section.helpTitle": "Kurdish, Arabic, English",
    "badge.customData": "Custom data",
    "badge.active": "Active",
    "form.fullName": "Full name",
    "form.phone": "Phone number",
    "form.blood": "Blood group",
    "form.allergies": "Allergies",
    "form.history": "Medical history, diagnosis, chronic disease, medication notes...",
    "form.department": "Department",
    "form.doctor": "Doctor",
    "form.visitReason": "Visit reason",
    "form.medicine": "Medicine / goods",
    "form.unitPrice": "Unit price IQD",
    "form.party": "Patient / supplier / account",
    "form.amount": "Amount",
    "form.description": "Description",
    "form.item": "Item name",
    "form.supplier": "Supplier",
    "form.totalCost": "Total cost IQD",
    "button.savePatient": "Save patient",
    "button.addVisit": "Add visit",
    "button.saveSale": "Save sale",
    "button.postEntry": "Post entry",
    "button.savePurchase": "Save purchase",
    "button.done": "Done",
    "button.export": "Export JSON",
    "button.clear": "Clear local data",
    "empty.patients": "No patients registered yet.",
    "empty.visits": "No visits in queue.",
    "empty.sales": "No POS receipts yet.",
    "empty.purchases": "No purchases recorded yet.",
    "empty.audit": "No actions recorded yet.",
    "empty.table": "No data yet.",
    "table.id": "ID",
    "table.patient": "Patient",
    "table.phone": "Phone",
    "table.blood": "Blood",
    "table.history": "History",
    "table.receipt": "Receipt",
    "table.item": "Item",
    "table.qty": "Qty",
    "table.total": "Total",
    "table.supplier": "Supplier",
    "table.cost": "Cost",
    "report.patients": "Patient count",
    "report.visits": "Visit count",
    "report.sales": "Sales income",
    "report.purchases": "Purchase expenses",
    "report.profit": "Net result",
    "chart.income": "Income",
    "chart.expenses": "Expenses",
    "chart.profitLabel": "Profit",
    "finance.income": "Total income",
    "finance.expenses": "Total expenses",
    "finance.loans": "Loans balance",
    "toast.saved": "Saved.",
    "toast.patientSaved": "Patient saved.",
    "toast.visitAdded": "Visit added.",
    "toast.saleSaved": "Sale saved.",
    "toast.financeSaved": "Finance entry saved.",
    "toast.purchaseSaved": "Purchase saved.",
    "toast.patientDeleted": "Patient deleted.",
    "toast.visitCompleted": "Visit completed.",
    "toast.authoritySaved": "Authority saved.",
    "toast.dataCleared": "Local data cleared.",
    "toast.exported": "System data exported as JSON.",
    "toast.patientDeletedConfirm": "Delete patient",
    "audit.ready": "Ready"
  },
  ku: {
    "nav.dashboard": "داشبۆرد",
    "nav.patients": "نەخۆشەکان",
    "nav.visits": "سەردانەکان",
    "nav.pharmacy": "POSی دەرمانخانە",
    "nav.finance": "دارایی",
    "nav.purchases": "کڕینەکان",
    "nav.reports": "ڕاپۆرتەکان",
    "nav.security": "دەسەڵاتەکان",
    "nav.archive": "ئارشیڤ",
    "nav.help": "یارمەتی",
    "topbar.system": "سیستەمی وێبەی ناوخۆ",
    "topbar.title": "سیستەمی بەڕێوەبردنی نەخۆشخانە",
    "topbar.searchPlaceholder": "گەڕان بەدوای نەخۆش، سەردان، وەسڵ و کڕینەکاندا...",
    "topbar.languageLabel": "زمانی یارمەتی",
    "hero.status": "هەموو داتاکان لەلای تۆ تۆمارکراون و لە ناوەوە پاشەکەوت دەکرێن",
    "hero.title": "بە شێوەیەکی وەڵامدەرەوە کاری زۆر لە یەک لایەنەوە بەڕێوەبەرە.",
    "hero.description": "نەخۆشەکان تۆمار بکە، سەردانەکان ڕیکخسە، دەرمان بفڕێنە، خەرجیەکان بەدوادا بگەڕێ، قەرزەکان بەڕێوەبەرە و سودیەکە بپێوانە.",
    "hero.addPatient": "زیادکردنی نەخۆش",
    "hero.export": "دەرکردنی JSON",
    "hero.clear": "سڕینەوەی داتای ناوخۆ",
    "hero.imageAria": "هەڵوەشاندنی کۆنتۆڵی نەخۆشخانە",
    "metrics.patients": "نەخۆشەکان",
    "metrics.visits": "سەردانە کراوەکان",
    "metrics.sales": "فرۆشتنی POS",
    "metrics.profit": "سودی پاک",
    "metrics.registered": "تۆمارکراو",
    "metrics.queue": "لە نێو ڕیزی چاوەروانیدا",
    "metrics.salesHint": "فرۆشتن",
    "metrics.profitHint": "داهات - خەرجی",
    "section.patientRegistry": "تۆماركردنی نەخۆش",
    "section.currentPosTotal": "کۆی POSی ئێستا",
    "button.savePatient": "پاشەکەوتی نەخۆش",
    "button.addVisit": "زیادکردنی سەردان",
    "button.saveSale": "پاشەکەوتی فرۆشتن",
    "button.postEntry": "بەردەوامی تۆمار",
    "button.savePurchase": "پاشەکەوتی کڕین",
    "empty.patients": "هێشتا هیچ نەخۆشێک تۆمار نەکراوە.",
    "empty.visits": "هێشتا هیچ سەردانێک لە ڕیزدا نییە.",
    "empty.sales": "هێشتا هیچ پسوڵەی POS نییە.",
    "empty.purchases": "هێشتا هیچ کڕینێک تۆمار نەکراوە.",
    "empty.audit": "هێشتا هیچ کردارێک تۆمار نەکراوە.",
    "toast.patientSaved": "نەخۆش پاشەکەوت کرا.",
    "toast.visitAdded": "سەردان زیادکرا.",
    "toast.saleSaved": "فرۆشتن پاشەکەوت کرا.",
    "toast.financeSaved": "تۆمارەکەی دارایی پاشەکەوت کرا.",
    "toast.purchaseSaved": "کڕین پاشەکەوت کرا.",
    "toast.patientDeleted": "نەخۆش سڕایەوە.",
    "toast.visitCompleted": "سەردان تەواو بوو.",
    "toast.authoritySaved": "دەسەڵات پاشەکەوت کرا.",
    "toast.dataCleared": "داتای ناوخۆ سڕایەوە.",
    "toast.exported": "داتای سیستەم وەک JSON دەرچوو.",
    "chart.income": "داهات",
    "chart.expenses": "خەرجی",
    "chart.profitLabel": "سود",
    "finance.income": "کۆی داهات",
    "finance.expenses": "کۆی خەرجی",
    "finance.loans": "میزانی قەرز"
  },
  ar: {
    "nav.dashboard": "لوحة التحكم",
    "nav.patients": "المرضى",
    "nav.visits": "الزيارات",
    "nav.pharmacy": "نقطة البيع",
    "nav.finance": "المالية",
    "nav.purchases": "المشتريات",
    "nav.reports": "التقارير",
    "nav.security": "الصلاحيات",
    "nav.archive": "الأرشيف",
    "nav.help": "المساعدة",
    "topbar.system": "نظام المتصفح المحلي",
    "topbar.title": "نظام إدارة المستشفى",
    "topbar.searchPlaceholder": "ابحث عن المرضى أو الزيارات أو الإيصالات أو المشتريات...",
    "topbar.languageLabel": "لغة المساعدة",
    "hero.status": "جميع البيانات تُدخل من قبلك وتُحفظ محليا",
    "hero.title": "إدارة عمليات العيادة الحقيقية من واجهة واحدة سريعة الاستجابة.",
    "hero.description": "سجّل المرضى، وجدول الزيارات، وبيع الأدوية، وتتبع المصاريف، وأدر القروض، واحسب الربح، وسيٍّر الصلاحيات، وحافظ على أرشيف مراجعة باستخدام localStorage.",
    "hero.addPatient": "إضافة مريض",
    "hero.export": "تصدير JSON",
    "hero.clear": "مسح البيانات المحلية",
    "hero.imageAria": "ممر مستشفى حديث",
    "metrics.patients": "المرضى",
    "metrics.visits": "الزيارات المفتوحة",
    "metrics.sales": "مبيعات نقطة البيع",
    "metrics.profit": "صافي الربح",
    "metrics.registered": "مسجّلون",
    "metrics.queue": "قائمة نشطة",
    "metrics.salesHint": "المبيعات",
    "metrics.profitHint": "الإيرادات - المصاريف",
    "section.patientRegistry": "سجل المرضى",
    "section.currentPosTotal": "إجمالي نقطة البيع الحالية",
    "button.savePatient": "حفظ المريض",
    "button.addVisit": "إضافة زيارة",
    "button.saveSale": "حفظ البيع",
    "button.postEntry": "إدخال سجل",
    "button.savePurchase": "حفظ الشراء",
    "empty.patients": "لا توجد مرضى مسجلين بعد.",
    "empty.visits": "لا توجد زيارات في الصف.",
    "empty.sales": "لا توجد إيصالات نقطة بيع بعد.",
    "empty.purchases": "لا توجد مشتريات مسجلة بعد.",
    "empty.audit": "لا توجد إجراءات مسجلة بعد.",
    "toast.patientSaved": "تم حفظ المريض.",
    "toast.visitAdded": "تمت إضافة الزيارة.",
    "toast.saleSaved": "تم حفظ البيع.",
    "toast.financeSaved": "تم حفظ إدخال المالية.",
    "toast.purchaseSaved": "تم حفظ الشراء.",
    "toast.patientDeleted": "تم حذف المريض.",
    "toast.visitCompleted": "تمت إكمال الزيارة.",
    "toast.authoritySaved": "تم حفظ الصلاحية.",
    "toast.dataCleared": "تم مسح البيانات المحلية.",
    "toast.exported": "تم تصدير بيانات النظام بصيغة JSON.",
    "chart.income": "الإيرادات",
    "chart.expenses": "المصاريف",
    "chart.profitLabel": "الربح",
    "finance.income": "إجمالي الإيرادات",
    "finance.expenses": "إجمالي المصاريف",
    "finance.loans": "رصيد القروض"
  }
};

function getText(key, fallback) {
  const lang = translations[state.language] || translations.en;
  return lang[key] || translations.en[key] || fallback || key;
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === "ar" || state.language === "ku" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", state.language === "ar" || state.language === "ku");

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const value = getText(element.dataset.i18n);
    if (value) element.textContent = value;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const value = getText(element.dataset.i18nPlaceholder);
    if (value) element.placeholder = value;
  });

  document.querySelectorAll("[data-i18n-aria]").forEach(element => {
    const value = getText(element.dataset.i18nAria);
    if (value) element.setAttribute("aria-label", value);
  });

  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) languageSelect.value = state.language;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved ? { ...emptyState, ...saved, roles: { ...emptyState.roles, ...(saved.roles || {}) } } : clone(emptyState);
  } catch (error) {
    return clone(emptyState);
  }
}

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.warn("Local storage is not available.", error);
  }
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

function money(value, currency = "IQD") {
  const amount = Number(value) || 0;
  if (currency === "USD") return `$${(amount / rate).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  return `${Math.round(amount).toLocaleString("en-US")} IQD`;
}

function toIQD(amount, currency) {
  return Number(amount || 0) * (currency === "USD" ? rate : 1);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function toast(message) {
  const toastElement = document.getElementById("appToast");
  document.getElementById("toastText").textContent = message;
  if (window.bootstrap?.Toast) {
    bootstrap.Toast.getOrCreateInstance(toastElement).show();
    return;
  }
  toastElement.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toastElement.classList.remove("show"), 2400);
}

function audit(text) {
  state.audit.unshift({
    id: uid("AUD"),
    time: new Date().toLocaleString("en-GB"),
    text
  });
  state.audit = state.audit.slice(0, 60);
  saveState();
  renderArchive();
}

function resetForm(form) {
  form.reset();
  form.querySelectorAll("input[type='number']").forEach(input => {
    if (input.min === "1") input.value = 1;
  });
}

function filtered(items, fields) {
  const query = document.getElementById("globalSearch").value.trim().toLowerCase();
  if (!query) return items;
  return items.filter(item => fields.some(field => String(item[field] || "").toLowerCase().includes(query)));
}

function renderPatientOptions() {
  const currentVisitPatient = document.getElementById("visitPatient").value;
  const currentSalePatient = document.getElementById("salePatient").value;
  const options = state.patients.map(patient => `<option value="${patient.id}">${escapeHTML(patient.name)} (${patient.id})</option>`).join("");
  document.getElementById("visitPatient").innerHTML = `<option value="">Select patient</option>${options}`;
  document.getElementById("salePatient").innerHTML = `<option value="">Walk-in / no patient</option>${options}`;
  if (state.patients.some(patient => patient.id === currentVisitPatient)) {
    document.getElementById("visitPatient").value = currentVisitPatient;
  } else if (state.patients.length === 1) {
    document.getElementById("visitPatient").value = state.patients[0].id;
  }
  if (state.patients.some(patient => patient.id === currentSalePatient)) {
    document.getElementById("salePatient").value = currentSalePatient;
  }
}

function renderPatients() {
  const rows = filtered(state.patients, ["id", "name", "phone", "history", "allergy"]).map(patient => `
    <tr>
      <td>${escapeHTML(patient.id)}</td>
      <td><strong>${escapeHTML(patient.name)}</strong><br><small>${escapeHTML(patient.gender)} · ${escapeHTML(patient.dob)}</small></td>
      <td>${escapeHTML(patient.phone)}</td>
      <td>${escapeHTML(patient.blood || "-")}</td>
      <td>${escapeHTML(patient.history)}</td>
      <td class="text-end"><button class="btn btn-sm btn-outline-danger" data-delete-patient="${patient.id}"><i class="bi bi-trash"></i></button></td>
    </tr>
  `).join("");
  document.getElementById("patientsTable").innerHTML = rows || `<tr><td colspan="6" class="text-center text-muted">${getText("empty.patients")}</td></tr>`;
  renderPatientOptions();
}

function renderVisits() {
  const openVisits = filtered(state.visits, ["patientName", "department", "doctor", "reason", "status"]);
  document.getElementById("visitsList").innerHTML = openVisits.map(visit => `
    <div class="queue-item">
      <div>
        <strong>${escapeHTML(visit.patientName)}</strong>
        <span>${escapeHTML(visit.department)} · Dr. ${escapeHTML(visit.doctor)} · ${escapeHTML(visit.reason)}</span>
      </div>
      <div class="visit-actions">
        <em>${escapeHTML(visit.priority)}</em>
        <button class="btn btn-sm btn-outline-success" data-complete-visit="${visit.id}">${getText("button.done")}</button>
      </div>
    </div>
  `).join("") || `<div class="empty-state">${getText("empty.visits")}</div>`;
}

function renderSales() {
  const sales = filtered(state.sales, ["receipt", "item", "patientName"]);
  document.getElementById("salesTable").innerHTML = sales.map(sale => `
    <tr>
      <td>${escapeHTML(sale.receipt)}<br><small>${escapeHTML(sale.date)}</small></td>
      <td>${escapeHTML(sale.item)}<br><small>${escapeHTML(sale.patientName || "Walk-in")}</small></td>
      <td>${sale.qty}</td>
      <td class="text-end">${money(sale.total)}</td>
    </tr>
  `).join("") || `<tr><td colspan="4" class="text-center text-muted">${getText("empty.sales")}</td></tr>`;
  document.getElementById("posTotal").textContent = money(state.sales.reduce((sum, sale) => sum + sale.total, 0));
}

function renderPurchases() {
  const purchases = filtered(state.purchases, ["item", "supplier"]);
  document.getElementById("purchaseTable").innerHTML = purchases.map(purchase => `
    <tr>
      <td>${escapeHTML(purchase.item)}<br><small>${escapeHTML(purchase.date)}</small></td>
      <td>${escapeHTML(purchase.supplier)}</td>
      <td>${purchase.qty}</td>
      <td class="text-end">${money(purchase.cost)}</td>
    </tr>
  `).join("") || `<tr><td colspan="4" class="text-center text-muted">${getText("empty.purchases")}</td></tr>`;
}

function renderFinance() {
  const income = state.finance.filter(entry => entry.type === "income").reduce((sum, entry) => sum + entry.amountIQD, 0);
  const expenses = state.finance.filter(entry => entry.type === "expense").reduce((sum, entry) => sum + entry.amountIQD, 0);
  const loansIn = state.finance.filter(entry => entry.type === "loan-in").reduce((sum, entry) => sum + entry.amountIQD, 0);
  const loansOut = state.finance.filter(entry => entry.type === "loan-out").reduce((sum, entry) => sum + entry.amountIQD, 0);
  document.getElementById("financeIncome").textContent = money(income, state.currency);
  document.getElementById("financeExpenses").textContent = money(expenses, state.currency);
  document.getElementById("financeLoans").textContent = money(loansIn - loansOut, state.currency);
}

function renderReports() {
  const sales = state.sales.reduce((sum, sale) => sum + sale.total, 0);
  const purchaseExpenses = state.purchases.reduce((sum, purchase) => sum + purchase.cost, 0);
  const ledgerIncome = state.finance.filter(entry => entry.type === "income").reduce((sum, entry) => sum + entry.amountIQD, 0);
  const ledgerExpenses = state.finance.filter(entry => entry.type === "expense").reduce((sum, entry) => sum + entry.amountIQD, 0);
  const income = sales + ledgerIncome;
  const expenses = purchaseExpenses + ledgerExpenses;
  const profit = income - expenses;

  document.getElementById("metricPatients").textContent = state.patients.length;
  document.getElementById("metricVisits").textContent = state.visits.length;
  document.getElementById("metricSales").textContent = money(sales, state.currency);
  document.getElementById("metricSalesUsd").textContent = money(sales, "USD");
  document.getElementById("metricProfit").textContent = money(profit, state.currency);
  document.getElementById("reportPatients").textContent = state.patients.length;
  document.getElementById("reportVisits").textContent = state.visits.length;
  document.getElementById("reportSales").textContent = money(income, state.currency);
  document.getElementById("reportPurchases").textContent = money(expenses, state.currency);
  document.getElementById("reportProfit").textContent = money(profit, state.currency);

  const max = Math.max(income, expenses, Math.abs(profit), 1);
  document.getElementById("reportBars").innerHTML = [
    [getText("chart.income"), income, "#047481"],
    [getText("chart.expenses"), expenses, "#d65f45"],
    [getText("chart.profitLabel"), Math.max(profit, 0), "#2f9e44"]
  ].map(([label, value, color]) => `
    <div class="chart-column"><span style="--h:${Math.max(4, (value / max) * 100)}%; --bar:${color}"></span><small>${label}</small></div>
  `).join("");
}

function renderArchive() {
  document.getElementById("auditFeed").innerHTML = state.audit.map(entry => `
    <div><strong>${escapeHTML(entry.time)}</strong><span>${escapeHTML(entry.text)}</span></div>
  `).join("") || `<div><strong>${getText("audit.ready")}</strong><span>${getText("empty.audit")}</span></div>`;
}

function renderRoles() {
  document.querySelectorAll("[data-role]").forEach(input => {
    input.checked = Boolean(state.roles[input.dataset.role]);
  });
}

function renderHelp() {
  const lines = helpText[state.language] || helpText.en;
  document.getElementById("helpBox").innerHTML = lines.map(line => `<p>${escapeHTML(line)}</p>`).join("");
}

function renderAll() {
  applyTranslations();
  renderPatients();
  renderVisits();
  renderSales();
  renderPurchases();
  renderFinance();
  renderReports();
  renderArchive();
  renderRoles();
  renderHelp();
}

function bindForms() {
  document.getElementById("patientForm").addEventListener("submit", event => {
    event.preventDefault();
    const patient = {
      id: uid("P"),
      name: patientName.value.trim(),
      phone: patientPhone.value.trim(),
      dob: patientDob.value,
      gender: patientGender.value,
      blood: patientBlood.value.trim(),
      allergy: patientAllergy.value.trim(),
      history: patientHistory.value.trim()
    };
    state.patients.unshift(patient);
    saveState();
    audit(`Patient registered: ${patient.name}.`);
    resetForm(event.target);
    renderAll();
    toast("Patient saved.");
  });

  document.getElementById("visitForm").addEventListener("submit", event => {
    event.preventDefault();
    const patient = state.patients.find(item => item.id === visitPatient.value);
    if (!patient) return toast("Please register and select a patient first.");
    state.visits.unshift({
      id: uid("V"),
      patientId: patient.id,
      patientName: patient.name,
      department: visitDepartment.value.trim(),
      doctor: visitDoctor.value.trim(),
      priority: visitPriority.value,
      reason: visitReason.value.trim(),
      status: "Open",
      date: new Date().toLocaleString("en-GB")
    });
    saveState();
    audit(`Visit opened for ${patient.name} in ${visitDepartment.value.trim()}.`);
    resetForm(event.target);
    renderAll();
    toast("Visit added.");
  });

  document.getElementById("saleForm").addEventListener("submit", event => {
    event.preventDefault();
    const patient = state.patients.find(item => item.id === salePatient.value);
    const qty = Number(saleQty.value);
    const price = Number(salePrice.value);
    const sale = {
      id: uid("S"),
      receipt: uid("RX"),
      item: saleItem.value.trim(),
      qty,
      unitPrice: price,
      total: qty * price,
      patientId: patient?.id || "",
      patientName: patient?.name || "",
      date: new Date().toLocaleString("en-GB")
    };
    state.sales.unshift(sale);
    state.finance.unshift({ id: uid("FIN"), type: "income", party: patient?.name || "POS customer", amountIQD: sale.total, note: `POS receipt ${sale.receipt}`, date: sale.date });
    saveState();
    audit(`POS receipt saved: ${sale.receipt} for ${money(sale.total)}.`);
    resetForm(event.target);
    renderAll();
    toast("Sale saved.");
  });

  document.getElementById("financeForm").addEventListener("submit", event => {
    event.preventDefault();
    const entry = {
      id: uid("FIN"),
      type: financeType.value,
      party: financeParty.value.trim(),
      amountIQD: toIQD(financeAmount.value, financeCurrency.value),
      originalAmount: Number(financeAmount.value),
      currency: financeCurrency.value,
      note: financeNote.value.trim(),
      date: new Date().toLocaleString("en-GB")
    };
    state.finance.unshift(entry);
    saveState();
    audit(`Finance entry posted: ${entry.type} for ${entry.party}.`);
    resetForm(event.target);
    renderAll();
    toast("Finance entry saved.");
  });

  document.getElementById("purchaseForm").addEventListener("submit", event => {
    event.preventDefault();
    const purchase = {
      id: uid("PUR"),
      item: purchaseItem.value.trim(),
      supplier: purchaseSupplier.value.trim(),
      qty: Number(purchaseQty.value),
      cost: Number(purchaseCost.value),
      date: new Date().toLocaleString("en-GB")
    };
    state.purchases.unshift(purchase);
    state.finance.unshift({ id: uid("FIN"), type: "expense", party: purchase.supplier, amountIQD: purchase.cost, note: `Purchase: ${purchase.item}`, date: purchase.date });
    saveState();
    audit(`Purchase saved: ${purchase.item} from ${purchase.supplier}.`);
    resetForm(event.target);
    renderAll();
    toast("Purchase saved.");
  });
}

function bindActions() {
  document.getElementById("menuToggle").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
      link.classList.add("active");
      document.querySelector(".sidebar").classList.remove("open");
    });
  });

  document.body.addEventListener("click", event => {
    const deletePatient = event.target.closest("[data-delete-patient]");
    if (deletePatient) {
      const patientId = deletePatient.dataset.deletePatient;
      const patient = state.patients.find(item => item.id === patientId);
      if (!confirm(`Delete patient ${patient?.name || patientId}?`)) return;
      state.patients = state.patients.filter(item => item.id !== patientId);
      state.visits = state.visits.filter(item => item.patientId !== patientId);
      saveState();
      audit(`Patient deleted: ${patient?.name || patientId}.`);
      renderAll();
      toast("Patient deleted.");
    }

    const completeVisit = event.target.closest("[data-complete-visit]");
    if (completeVisit) {
      const visit = state.visits.find(item => item.id === completeVisit.dataset.completeVisit);
      state.visits = state.visits.filter(item => item.id !== completeVisit.dataset.completeVisit);
      saveState();
      audit(`Visit completed: ${visit?.patientName || "unknown patient"}.`);
      renderAll();
      toast("Visit completed.");
    }
  });

  document.querySelectorAll("[data-currency]").forEach(button => {
    button.addEventListener("click", () => {
      state.currency = button.dataset.currency;
      document.querySelectorAll("[data-currency]").forEach(item => item.classList.toggle("active", item === button));
      saveState();
      renderAll();
    });
  });

  document.querySelectorAll("[data-role]").forEach(input => {
    input.addEventListener("change", () => {
      state.roles[input.dataset.role] = input.checked;
      saveState();
      audit(`Authority changed: ${input.parentElement.textContent.trim()}.`);
      toast("Authority saved.");
    });
  });

  document.getElementById("languageSelect").addEventListener("change", event => {
    state.language = event.target.value;
    saveState();
    renderAll();
    audit(`Help language changed to ${event.target.options[event.target.selectedIndex].text}.`);
  });

  document.getElementById("globalSearch").addEventListener("input", renderAll);

  document.getElementById("exportData").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `shifacare-hms-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    audit("System data exported as JSON.");
  });

  document.getElementById("clearData").addEventListener("click", () => {
    if (!confirm("Clear all locally saved hospital data?")) return;
    state = clone(emptyState);
    saveState();
    renderAll();
    toast("Local data cleared.");
  });
}

bindForms();
bindActions();
renderAll();
