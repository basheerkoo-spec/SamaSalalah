"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [result, setResult] = useState(null);

  const [search, setSearch] = useState({
    checkIn: "",
    checkOut: "",
    area: "",
    minPrice: 0,
    maxPrice: 100,
  });

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    fetch("http://localhost:4000/units")
      .then((res) => res.json())
      .then((data) => setUnits(data))
      .catch(() => setUnits([]));
  }, []);

  function handleSearchChange(e) {
    const { name, value } = e.target;

    setSearch({
      ...search,
      [name]: name.includes("Price") ? Number(value) : value,
    });
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchesArea =
        !search.area ||
        unit.area === search.area ||
        unit.description.includes(search.area) ||
        unit.title.includes(search.area);

      const matchesPrice =
        unit.dailyPrice >= search.minPrice &&
        unit.dailyPrice <= search.maxPrice;

      return matchesArea && matchesPrice;
    });
  }, [units, search]);

  async function submitBooking(e) {
    e.preventDefault();

    if (!selectedUnit) return;

    const res = await fetch("http://localhost:4000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unitId: selectedUnit.id,
        customerName: form.customerName,
        phone: form.phone,
        checkIn: form.checkIn || search.checkIn,
        checkOut: form.checkOut || search.checkOut,
      }),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial", direction: "rtl" }}>
      <section
        style={{
          padding: 30,
          borderRadius: 20,
          background: "#0f172a",
          color: "#fff",
          marginBottom: 30,
        }}
      >
        <h1 style={{ marginTop: 0 }}>سما صلالة العقارية</h1>
        <p>ابحث عن شقتك أو غرفتك في صلالة حسب التاريخ والمنطقة والسعر</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 15,
            marginTop: 25,
          }}
        >
          <div>
            <label>من تاريخ</label>
            <input
              type="date"
              name="checkIn"
              value={search.checkIn}
              onChange={(e) => {
                handleSearchChange(e);
                setForm({ ...form, checkIn: e.target.value });
              }}
              style={inputStyle}
            />
          </div>

          <div>
            <label>إلى تاريخ</label>
            <input
              type="date"
              name="checkOut"
              value={search.checkOut}
              onChange={(e) => {
                handleSearchChange(e);
                setForm({ ...form, checkOut: e.target.value });
              }}
              style={inputStyle}
            />
          </div>

          <div>
            <label>المنطقة</label>
            <select
              name="area"
              value={search.area}
              onChange={handleSearchChange}
              style={inputStyle}
            >
              <option value="">كل المناطق</option>
              <option value="عوقد الشمالية">عوقد الشمالية</option>
              <option value="صلالة الجديدة">صلالة الجديدة</option>
              <option value="الحصيلة">الحصيلة</option>
              <option value="السعادة">السعادة</option>
              <option value="عوقد الجنوبية">عوقد الجنوبية</option>
            </select>
          </div>

          <div>
            <label>أقل سعر يومي: {search.minPrice} ريال</label>
            <input
              type="range"
              name="minPrice"
              min="0"
              max="100"
              value={search.minPrice}
              onChange={handleSearchChange}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label>أعلى سعر يومي: {search.maxPrice} ريال</label>
            <input
              type="range"
              name="maxPrice"
              min="0"
              max="100"
              value={search.maxPrice}
              onChange={handleSearchChange}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </section>

      <h2>نتائج البحث: {filteredUnits.length}</h2>

      <div style={{ display: "grid", gap: 25 }}>
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            style={{
              display: "grid",
              gridTemplateColumns:
                selectedUnit?.id === unit.id ? "1fr 1fr" : "1fr",
              gap: 20,
              border: "1px solid #ddd",
              borderRadius: 16,
              overflow: "hidden",
              maxWidth: selectedUnit?.id === unit.id ? 1000 : 520,
            }}
          >
            <div>
              <img
                src={unit.image}
                alt={unit.title}
                style={{
                  width: "100%",
                  height: 260,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: 20 }}>
                <h3>{unit.title}</h3>
                <p>{unit.description}</p>

                <p>السعر اليومي: {unit.dailyPrice} ريال</p>
                <p>السعر الشهري: {unit.monthlyPrice} ريال</p>
                <p>السعر السنوي: {unit.yearlyPrice} ريال</p>

                <p>
                  الحالة: {unit.status === "available" ? "متاحة" : "محجوزة"}
                </p>

                <button
                  disabled={unit.status !== "available"}
                  onClick={() => {
                    setSelectedUnit(unit);
                    setResult(null);
                    setForm({
                      ...form,
                      checkIn: search.checkIn,
                      checkOut: search.checkOut,
                    });
                  }}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 10,
                    border: "none",
                    background: unit.status === "available" ? "#111" : "#ccc",
                    color: "#fff",
                    cursor:
                      unit.status === "available" ? "pointer" : "not-allowed",
                  }}
                >
                  {unit.status === "available" ? "احجز الآن" : "غير متاحة"}
                </button>
              </div>
            </div>

            {selectedUnit?.id === unit.id && (
              <div
                style={{
                  padding: 25,
                  borderRight: "1px solid #eee",
                  background: "#fafafa",
                }}
              >
                <h2>نموذج الحجز</h2>
                <p>الوحدة المختارة: {selectedUnit.title}</p>

                <form
                  onSubmit={submitBooking}
                  style={{ display: "grid", gap: 12 }}
                >
                  <input
                    name="customerName"
                    placeholder="اسم العميل"
                    value={form.customerName}
                    onChange={handleChange}
                    required
                    style={formInputStyle}
                  />

                  <input
                    name="phone"
                    placeholder="رقم الهاتف"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    style={formInputStyle}
                  />

                  <label>تاريخ الدخول</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                    required
                    style={formInputStyle}
                  />

                  <label>تاريخ الخروج</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleChange}
                    required
                    style={formInputStyle}
                  />

                  <button
                    type="submit"
                    style={{
                      padding: 14,
                      borderRadius: 10,
                      border: "none",
                      background: "#0f172a",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    تأكيد الحجز
                  </button>
                </form>

                {result && (
                  <div
                    style={{
                      marginTop: 20,
                      padding: 15,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "#fff",
                    }}
                  >
                    <h3>{result.message}</h3>

                    {result.booking && (
                      <>
                        <p>رقم الحجز: {result.booking.id}</p>
                        <p>
                          هل يستطيع العميل الإلغاء؟{" "}
                          {result.booking.canCustomerCancel ? "نعم" : "لا"}
                        </p>
                        <p>
                          هل يستطيع العميل التمديد؟{" "}
                          {result.booking.canCustomerExtend ? "نعم" : "لا"}
                        </p>

                        <h4>رسالة واتساب مؤقتة</h4>
                        <p>{result.booking.whatsappMessage}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "none",
  marginTop: 8,
};

const formInputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
};