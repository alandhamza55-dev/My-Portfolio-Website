
window.PRODUCTS=[
{id:1,name:"Paracetamol 500mg",category:"Pain Relief",price:4.50,img:"assets/images/med_01.svg"},
{id:2,name:"Ibuprofen 200mg",category:"Pain Relief",price:5.25,img:"assets/images/med_02.svg"},
{id:3,name:"Vitamin C 1000mg",category:"Vitamins",price:9.99,img:"assets/images/med_03.svg"},
{id:4,name:"Zinc + D3",category:"Vitamins",price:12.00,img:"assets/images/med_04.svg"},
{id:5,name:"Cough Syrup",category:"Cold & Flu",price:6.75,img:"assets/images/med_05.svg"},
{id:6,name:"Antihistamine Tabs",category:"Allergy",price:7.50,img:"assets/images/med_06.svg"},
{id:7,name:"Digital Thermometer",category:"Devices",price:14.99,img:"assets/images/med_07.svg"},
{id:8,name:"BP Monitor",category:"Devices",price:49.00,img:"assets/images/med_08.svg"},
{id:9,name:"Hand Sanitizer",category:"Hygiene",price:3.20,img:"assets/images/med_09.svg"},
{id:10,name:"N95 Face Mask",category:"Hygiene",price:1.90,img:"assets/images/med_10.svg"},
{id:11,name:"Glucometer Strips",category:"Diabetes",price:18.50,img:"assets/images/med_11.svg"},
{id:12,name:"Insulin Pen",category:"Diabetes",price:29.00,img:"assets/images/med_12.svg"}
];
window.CATEGORIES=["All",...Array.from(new Set(window.PRODUCTS.map(p=>p.category)))];
