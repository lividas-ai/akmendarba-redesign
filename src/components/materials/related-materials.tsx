import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Material } from "@/client/materials";

type RelatedMaterialsProps = {
  materials: readonly Material[];
  categoryName: string;
};

export function RelatedMaterials({ materials, categoryName }: RelatedMaterialsProps) {
  return (
    <section className="related-materials section" aria-labelledby="related-materials-title">
      <div className="content-shell">
        <header className="related-materials__header">
          <div>
            <span className="eyebrow">Ta pati rūšis</span>
            <h2 id="related-materials-title">Kiti šios rūšies variantai</h2>
          </div>
          <Link className="text-link" href={`/akmuo?tipas=${materials[0]?.category ?? ""}`}>
            Visa rūšies kolekcija <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </header>

        <div className="related-materials__rail">
          {materials.map((material) => (
            <Link className="related-material" href={`/akmuo/${material.slug}`} key={material.slug}>
              <span className="related-material__visual">
                <Image
                  alt={`${material.name} akmens katalogo vaizdas`}
                  fill
                  loading="lazy"
                  sizes="(min-width: 64rem) 24vw, (min-width: 40rem) 42vw, 76vw"
                  src={material.localPath}
                />
              </span>
              <span>
                <span>{categoryName}</span>
                <strong>{material.name}</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={19} strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
