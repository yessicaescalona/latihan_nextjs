"use client";
import { useState, useEffect } from "react";
import { rupiah, type Event } from "@/data/events";
import KartuEvent from "./KartuEvent";
import KontrolKatalog from "./KontrolKatalog";

export default function KatalogInteraktif({ events }: { events: Event[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("tanggal");

  useEffect(() => {
    const savedUrut = localStorage.getItem("urut");
    if (savedUrut) setUrut(savedUrut);
  }, []);

  const handleUrutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setUrut(val);
    localStorage.setItem("urut", val);
    setJumlahTampil(4);
  };

  const [hanyaAdaTiket, setHanyaAdaTiket] = useState(false);
  const [hargaMaks, setHargaMaks] = useState("");
  const [jumlahTampil, setJumlahTampil] = useState(4);

  const daftarKategori = ["Semua", ...new Set(events.map((e) => e.kategori))];

  const hasil = events.filter((e) => {
    const sisa = e.kuota - e.terisi;
    const cocokCari = e.judul.toLowerCase().includes(cari.toLowerCase());
    const cocokKategori = kategori === "Semua" || e.kategori === kategori;
    const cocokTiket = !hanyaAdaTiket || sisa > 0;
    const cocokHarga = hargaMaks === "" || e.harga <= Number(hargaMaks);
    return cocokCari && cocokKategori && cocokTiket && cocokHarga;
  });

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === "murah") return a.harga - b.harga;
    if (urut === "mahal") return b.harga - a.harga;
    if (urut === "nama") return a.judul.localeCompare(b.judul);
    return a.tanggal.localeCompare(b.tanggal);
  });

  const totalHarga = tersusun.reduce((acc, e) => acc + e.harga, 0);
  const totalSisa = tersusun.reduce((acc, e) => acc + (e.kuota - e.terisi), 0);
  const rataRataHarga = tersusun.length > 0 ? totalHarga / tersusun.length : 0;
  const eventTampil = tersusun.slice(0, jumlahTampil);

  return (
    <div>
      <KontrolKatalog
        cari={cari}
        setCari={(val) => { setCari(val); setJumlahTampil(4); }}
        kategori={kategori}
        setKategori={(val) => { setKategori(val); setJumlahTampil(4); }}
        daftarKategori={daftarKategori}
        urut={urut}
        setUrut={setUrut}
        handleUrutChange={handleUrutChange}
        hanyaAdaTiket={hanyaAdaTiket}
        setHanyaAdaTiket={(val) => { setHanyaAdaTiket(val); setJumlahTampil(4); }}
        hargaMaks={hargaMaks}
        setHargaMaks={(val) => { setHargaMaks(val); setJumlahTampil(4); }}
      />

      <p className="text-sm text-slate-500">{tersusun.length} event ditemukan</p>
      <p className="mb-3 text-sm text-slate-500">
        Rata-rata harga {rupiah(rataRataHarga)} · Total sisa tiket {totalSisa}
      </p>

      {tersusun.length === 0 ? (
        <p className="text-slate-500">Tidak ada event yang cocok.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventTampil.map((e) => (
              <KartuEvent key={e.id} event={e} />
            ))}
          </div>

          {jumlahTampil < tersusun.length && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setJumlahTampil((prev) => prev + 4)}
                className="rounded bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
              >
                Tampilkan lagi ({tersusun.length - jumlahTampil} lagi)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}