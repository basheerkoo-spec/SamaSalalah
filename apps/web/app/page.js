"use client";

import { useEffect, useMemo, useState } from "react";
import "./style.css";

const API_URL = "http://localhost:4000";

export default function HomePage() {
  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("2026-07-10");
  const [checkOut, setCheckOut] = useState("2026-07-15");
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/units`)
      .then((response) => response.json())
      .then(setUnits)
      .catch(() => setError("تعذر الاتصال بالخادم. تأكد أن API يعمل على المنفذ 4000."));
  }, []);

  const selectedUnit = useMemo(
    () => units.find((unit) => unit.id === Number(selectedUnitId)),
    [units, selectedUnitId]
  );

  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const value = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return value > 0 ? value : 0;
  }, [checkIn, checkOut]);

  const totalPrice = selectedUnit ? nights * selectedUnit.dailyPrice : 0;

  async function submitBooking(event) {
    event.preventDefault();
    setError("");
    setBookingResult(null);

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId: Number(selectedUnitId),
          customerName,
          phone,
          checkIn,
          checkOut,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "حدث خطأ أثناء إنشاء الحجز");
        return;
      }

      setBookingResult(data.booking);
    } catch {
      setError("تعذر إرسال الحجز. تأكد أن API يعمل.");
    }
  }

  return (
    <main className="page" dir="rtl">
      <section className="hero">
        <div>
          <p className="eyebrow">Sama Salalah Real Estate</p>
          <h1>احجز وحدتك في صلالة من تاريخ إلى تاريخ</h1>
          <p>
            اختر الوحدة، أدخل تاريخ الوصول والمغادرة، وسيتم حساب عدد الليالي والإجمالي تلقائياً.
          </p>
        </div>
      </section>

      <section className="grid">
        <div className="card form-card">
          <h2>بيانات الحجز</h2>
          <form onSubmit={submitBooking}>
            <label>الوحدة</label>
            <select value={selectedUnitId} onChange={(e) => setSelectedUnitId(e.target.value)}>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.title} - {unit.dailyPrice} ريال / ليلة
                </option>
              ))}
            </select>

            <label>اسم العميل</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="اسم العميل" required />

            <label>رقم الهاتف</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="مثال: 90250060" required />

            <div className="two-columns">
              <div>
                <label>من تاريخ</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
              </div>
              <div>
                <label>إلى تاريخ</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
              </div>
            </div>

            <div className="summary-box">
              <span>عدد الليالي</span>
              <strong>{nights}</strong>
              <span>الإجمالي</span>
              <strong>{totalPrice} ريال عماني</strong>
            </div>

            <button type="submit">تأكيد الحجز</button>
          </form>

          {error && <p className="error">{error}</p>}
          {bookingResult && (
            <div className="success">
              <h3>تم إنشاء الحجز</h3>
              <p>الوحدة: {bookingResult.unitTitle}</p>
              <p>عدد الليالي: {bookingResult.nights}</p>
              <p>الإجمالي: {bookingResult.totalPrice} ريال عماني</p>
              <p>{bookingResult.whatsappMessage}</p>
            </div>
          )}
        </div>

        <div className="units-list">
          {units.map((unit) => (
            <article className="unit-card" key={unit.id}>
              <img src={unit.image} alt={unit.title} />
              <div>
                <h3>{unit.title}</h3>
                <p>{unit.description}</p>
                <strong>{unit.dailyPrice} ريال عماني / ليلة</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
