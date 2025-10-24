import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BuddyPostAPI } from "../../api/buddy";
import MainLayout from "../../components/layout/MainLayout";

const TRIP_TYPE_OPTIONS = [
  { label: "선택 없음(기타)", value: "OTHER" },
  { label: "국내여행", value: "DOMESTIC" },
  { label: "해외여행", value: "OVERSEAS" },
  { label: "캠핑", value: "CAMPING" },
  { label: "당일치기", value: "DAY_TRIP" },
];

export default function BuddyCreateForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    locationCode: "",
    address: "",
    startDate: "",
    endDate: "",
    capacity: "",
    tagsText: "",
    tripType: "OTHER",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "제목을 입력하세요.";
    if (!form.content.trim()) return "내용을 입력하세요.";
    if (!form.locationCode.trim()) return "지역코드(locationCode)를 입력하세요.";
    if (!form.startDate || !form.endDate) return "기간(시작/종료일)을 입력하세요.";
    if (new Date(form.startDate) > new Date(form.endDate)) return "종료일이 시작일보다 빠를 수 없습니다.";
    if (form.capacity && Number(form.capacity) <= 0) return "정원은 1명 이상이어야 합니다.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        locationCode: form.locationCode.trim(),
        address: form.address.trim() || null,
        startDate: form.startDate,
        endDate: form.endDate,
        capacity: form.capacity ? Number(form.capacity) : null,
        tags: form.tagsText
          ? form.tagsText.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        tripType: form.tripType || "OTHER",
      };
      const { data } = await BuddyPostAPI.create(payload);
      alert("모집글이 등록되었습니다.");
      nav(`/buddies/${data.id}`);
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout className="p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">동행 모집글 작성</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">제목 *</label>
            <input className="w-full border rounded p-2" name="title" value={form.title} onChange={onChange} />
          </div>

          <div>
            <label className="block text-sm mb-1">내용 *</label>
            <textarea className="w-full border rounded p-2" name="content" rows={6} value={form.content} onChange={onChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">지역코드(locationCode) *</label>
              <input className="w-full border rounded p-2" name="locationCode" value={form.locationCode} onChange={onChange} />
            </div>
            <div>
              <label className="block text-sm mb-1">상세 주소(선택)</label>
              <input className="w-full border rounded p-2" name="address" value={form.address} onChange={onChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1">여행유형</label>
              <select className="w-full border rounded p-2" name="tripType" value={form.tripType} onChange={onChange}>
                {TRIP_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">시작일 *</label>
              <input type="date" className="w-full border rounded p-2" name="startDate" value={form.startDate} onChange={onChange} />
            </div>
            <div>
              <label className="block text-sm mb-1">종료일 *</label>
              <input type="date" className="w-full border rounded p-2" name="endDate" value={form.endDate} onChange={onChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">정원(선택)</label>
              <input type="number" className="w-full border rounded p-2" name="capacity" value={form.capacity} onChange={onChange} min={1} />
            </div>
            <div>
              <label className="block text-sm mb-1">태그(쉼표 구분, 선택)</label>
              <input className="w-full border rounded p-2" name="tagsText" value={form.tagsText} onChange={onChange} />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button type="submit" className="px-4 py-2 rounded border" disabled={submitting}>
              {submitting ? "등록 중…" : "등록"}
            </button>
            <button type="button" className="px-4 py-2 rounded border" onClick={() => nav(-1)}>
              취소
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
