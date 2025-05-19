"use client";

import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useAuth} from "../../../../context/AuthContext";
import Link from "next/link";
import api from "@/app/lib/api";

const EditBiodata = () => {
  const {id} = useParams(); // mengambil parameter ID dari URL
  const {token} = useAuth(); // mengambil token autentikasi
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // menyimpan preview gambar foto

  // state untuk menyimpan data form
  const [formData, setFormData] = useState<BiodataForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: null,
  });

  // mengambil data biodata berdasarkan ID saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/biodata/${id}`);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
          photo: null, // tidak mengisi dengan URL karena akan ditimpa file jika diubah
        });
        setPhotoPreview(res.data.photo); // simpan url foto untuk ditampilkan
      } catch (err) {
        console.error("Gagal mengambil data biodata:", err);
      }
    };

    if (id) fetchData(); // hanya fetch jika ID tersedia
  }, [id, token]);

  // handler untuk perubahan input form, termasuk file gambar
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, files} = e.target;

    // jika input adalah file dan ada file yg dipilih
    if (type === "file" && files && files.length > 0) {
      const file = files[0]; // ambil file pertama
      setFormData({...formData, photo: file}); // menyimpan file ke state
      setPhotoPreview(URL.createObjectURL(file)); // menampilkan preview sementara
    } else {
      // jika input bisa
      setFormData({...formData, [name]: value}); // menyimpan input teks
    }
  };

  // handler saat form disubmit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // siapkan FormData untuk mengirim data termasuk file
    const data = new FormData();

    // tambahkan semua field teks ke FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "photo") data.append(key, value); // tambahkan semua field kecuali foto
    });

    // jika ada file foto baru yang diunggah, tambahkan ke FormData
    if (formData.photo instanceof File) {
      data.append("photo", formData.photo); // hanya tambahkan foto jika berupa File baru
    }

    try {
      // kirim data ke backend dengan method PUT
      await api.put(`/biodata/edit/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // perlu untuk FormData
        },
      });

      alert("Biodata berhasil diperbarui!");
      router.push("/biodata");
    } catch (err) {
      console.error("Gagal mengupdate biodata:", err);
      alert("Terjadi kesalahan saat memperbarui data.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xl font-bold">Edit Biodata</p>
        <button>
          <Link href="/biodata" className="flex items-center gap-2">
            Kembali
          </Link>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nama</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">No Telepon</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Alamat</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Foto</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-20 h-20 mt-2 rounded-full object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Update Biodata
        </button>
      </form>
    </div>
  );
};

export default EditBiodata;
