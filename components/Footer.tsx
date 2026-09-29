import { Facebook, Twitter, Instagram, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer dir="rtl" className="bg-white text-gray-700 border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-500">
              سرزمین میانه
            </h3>
            <p className="text-sm text-gray-600">
              دیدگاه اصلی سرزمین میانه، تولید و عرضه کتاب‌های مورد نیاز
              دانش‌آموزان، دانشجویان و دانش‌آموزان با بهترین کیفیت و مناسب‌ترین
              قیمت می‌باشد.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                aria-label="facebook"
                className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white hover:opacity-90"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                aria-label="twitter"
                className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:opacity-90"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                aria-label="instagram"
                className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white hover:opacity-90"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="telegram"
                className="w-9 h-9 rounded-full bg-rose-500 flex items-center justify-center text-white hover:opacity-90"
              >
                <Send size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3">خدمات مشتریان</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>راهنمای خرید کتاب</li>
              <li>پیگیری سفارشات</li>
              <li>پرسش‌های متداول</li>
              <li>وبلاگ آموزشی</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3">سفارشات تلفنی</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>شنبه تا چهارشنبه: 9 الی 18</li>
              <li>پنج‌شنبه‌ها: 9 الی 15</li>
              <li>۰713-8236638</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3">خرید حضوری</h4>
            <p className="text-sm text-gray-600">شیراز شهرک فرهنگیان</p>
            <p className="text-sm text-gray-600 mt-2">
              ساعت کاری فروشگاه: همه روزه 9 الی 20
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          © 2026 سرزمین میانه. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
