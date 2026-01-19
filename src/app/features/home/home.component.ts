import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { HeaderComponent } from "../../shared/components/header/header.component"
import { FooterComponent } from "../../shared/components/footer/footer.component"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  modules = [
    {
      title: "Approvisionnement",
      description: "Gestion des fournisseurs, matières premières et commandes d'approvisionnement",
      icon: "📦",
      features: ["Fournisseurs", "Matières Premières", "Commandes"],
    },
    {
      title: "Production",
      description: "Ordres de production, produits finis et gestion des ressources",
      icon: "🏭",
      features: ["Produits Finis", "Ordres de Production", "Nomenclatures"],
    },
    {
      title: "Livraison & Distribution",
      description: "Gestion des clients, commandes et livraisons",
      icon: "🚚",
      features: ["Clients", "Commandes Clients", "Livraisons"],
    },
    {
      title: "Administration",
      description: "Gestion des utilisateurs et supervision globale",
      icon: "⚙️",
      features: ["Utilisateurs", "Rôles", "Paramètres"],
    },
  ]
}
