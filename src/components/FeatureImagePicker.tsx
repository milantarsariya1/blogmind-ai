import { Check } from "lucide-react";

export const PREDEFINED_IMAGES = [
  "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800", // AI
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800", // React
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800", // Design
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800", // Desk
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800", // Coding
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800", // Abstract
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800", // Gadgets
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800", // Remote Work
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800"  // Writing
];

interface FeatureImagePickerProps {
  selectedImage: string;
  onSelect: (imageUrl: string) => void;
}

export default function FeatureImagePicker({ selectedImage, onSelect }: FeatureImagePickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        Choose a Cover Feature Image
      </label>
      <div className="grid grid-cols-3 gap-3">
        {PREDEFINED_IMAGES.map((imgUrl, index) => {
          const isSelected = selectedImage === imgUrl;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(imgUrl)}
              className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 group focus:outline-none ${
                isSelected
                  ? "border-indigo-600 ring-2 ring-indigo-600/30"
                  : "border-transparent hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <img
                src={imgUrl}
                alt={`Preset cover ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div
                className={`absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors ${
                  isSelected ? "bg-slate-950/40" : ""
                }`}
              />
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-indigo-600 text-white p-1.5 rounded-full shadow-md">
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
