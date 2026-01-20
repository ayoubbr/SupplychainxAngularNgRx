# NgRx Customer Module - SupplyChainX

> Extension NgRx pour la gestion complète des Clients (CRUD) du module Livraison & Distribution

## 📋 Table des matières

- [Contexte & Objectifs](#contexte--objectifs)
- [Périmètre fonctionnel](#périmètre-fonctionnel)
- [Architecture NgRx](#architecture-ngrx)
- [Règles métier](#règles-métier)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Endpoints API](#endpoints-api)
- [Exigences UX](#exigences-ux)
- [Workflows clés](#workflows-clés)
- [Livrables](#livrables)
- [Critères de réussite](#critères-de-réussite)

---

## 🎯 Contexte & Objectifs

Cette extension implémente NgRx pour la gestion complète des Clients dans le système SupplyChainX. Elle servira de modèle d'apprentissage NgRx avant extension à d'autres modules.

### Bénéfices attendus

- **Centralisation** de l'état applicatif
- **Traçabilité** des actions utilisateur
- **Code maintenable** et testable
- **UX fluide** avec gestion du cache

---

## 🗺️ Périmètre fonctionnel

### Routes et composants

| Route | Composant | Fonction |
|-------|-----------|----------|
| `/delivery/customers` | `CustomerListComponent` | Liste paginée avec recherche/tri |
| `/delivery/customers/new` | `CustomerFormComponent` | Création client |
| `/delivery/customers/:id` | `CustomerDetailComponent` | Détail client |
| `/delivery/customers/:id/edit` | `CustomerFormComponent` | Modification client |

### Fonctionnalités couvertes

- ✅ **Liste** : pagination (10/20/50), recherche (nom/adresse/ville), tri (nom/ville)
- ✅ **Détail** : affichage infos + statistiques commandes
- ✅ **Création** : formulaire validé (client + serveur)
- ✅ **Modification** : pré-remplissage + validation
- ✅ **Suppression** : avec vérification `hasActiveOrders`

---

## 🏗️ Architecture NgRx

### 1. Modèle de données

```typescript
Customer = {
  id: number;
  name: string;              // 3-100 caractères
  address: string;           // 10-255 caractères
  city: string;              // 2-50 caractères
  ordersCount?: number;
  hasActiveOrders?: boolean; // Bloque la suppression
}
```

### 2. State

```typescript
CustomerState = {
  query: { page, size, sort, search };
  customers: Customer[];
  selectedCustomer: Customer | null;
  totalElements: number;
  totalPages: number;
  loadingList: boolean;
  loadingDetail: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  error: { operation, status, message, detail } | null;
  lastOperation: { type, status, customerId? };
}
```

### 3. Actions

#### Liste
- `setSearchParams`, `resetFilters`
- `loadCustomers`, `loadCustomersSuccess`, `loadCustomersFailure`

#### Détail
- `loadCustomerById`, `loadCustomerByIdSuccess`, `loadCustomerByIdFailure`
- `selectCustomer`, `clearSelectedCustomer`

#### Create
- `createCustomer`, `createCustomerSuccess`, `createCustomerFailure`

#### Update
- `updateCustomer`, `updateCustomerSuccess`, `updateCustomerFailure`

#### Delete
- `deleteCustomer`, `deleteCustomerSuccess`, `deleteCustomerFailure`

#### Utilitaires
- `resetLastOperation`, `clearError`

### 4. Effects

Chaque effect écoute son action, appelle `CustomerService`, puis dispatch `Success` ou `Failure` + toast/navigation.

**Exemple :**
```typescript
loadCustomers$ → CustomerService.getCustomers(query) 
               → loadCustomersSuccess / loadCustomersFailure
```

### 5. Selectors

- `selectCustomers`
- `selectSelectedCustomer`
- `selectSearchParams`
- `selectLoadingList`, `selectLoadingDetail`, `selectLoadingCreate`, `selectLoadingUpdate`, `selectLoadingDelete`
- `selectError`
- `selectLastOperation`
- `selectPaginationInfo`
- `selectIsLoading`

### 6. Service (CustomerService)

⚠️ **Utilisé uniquement dans les Effects**, jamais directement dans les composants

```typescript
getCustomers(params): Observable<PageResponse>
getCustomerById(id): Observable<Customer>
createCustomer(customer): Observable<Customer>
updateCustomer(id, customer): Observable<Customer>
deleteCustomer(id): Observable<void>
```

---

## 📐 Règles métier

### Validation formulaire

| Champ | Règles |
|-------|--------|
| **Nom** | Obligatoire, 3-100 car., unique |
| **Adresse** | Obligatoire, 10-255 car. |
| **Ville** | Obligatoire, 2-50 car. |

### Suppression

🚫 **Interdite** si `hasActiveOrders = true`

> **Dialog avec message :** "Attention : ce client a [N] commande(s) active(s). La suppression est impossible."

### Recherche

- Insensible à la casse
- Sur 3 champs : `name`, `address`, `city`
- Debounce 300-500ms

---

## ⚠️ Gestion des erreurs

| Code | Opération | Message |
|------|-----------|---------|
| **401** | Toutes | Refresh token automatique |
| **403** | Toutes | Redirection page 403 |
| **404** | Détail/Update/Delete | "Client introuvable" + redirection liste |
| **409** | Create/Update | "Un client avec ce nom existe déjà" |
| **409** | Delete | "Impossible de supprimer (commandes actives)" |
| **400** | Create/Update | Messages sous champs en erreur |
| **500** | Liste | "Erreur lors du chargement" |

### Affichage

- **Toast** (5s) pour succès/erreur global
- **Messages sous champs** pour validation
- **Dialog** pour erreurs critiques
- **Message inline** pour suppression bloquée

---

## 🔌 Endpoints API

```
GET    /customers?page=0&size=10&sort=name,asc&search=
GET    /customers/:id
POST   /customers
PUT    /customers/:id
DELETE /customers/:id
```

---

## 🎨 Exigences UX

### Indicateurs de chargement

- **Liste** : spinner sur tableau
- **Formulaire** : bouton désactivé + spinner
- **Dialog** : bouton désactivé + spinner

### Messages

- ✅ **Succès** : "Client créé/modifié/supprimé avec succès"
- ❌ **Erreur** : "[Opération] échouée : [message backend]"

### États

- **Chargement** → Spinner
- **Vide** → "Aucun client ne correspond à vos critères"
- **Erreur** → Toast + message détaillé

---

## 🔄 Workflows clés

### Création

1. Clic "Nouveau client" → `/delivery/customers/new`
2. Remplissage formulaire
3. Clic "Enregistrer" → dispatch `createCustomer`
4. Effect → API → Success : toast + navigation `/delivery/customers` + `loadCustomers`

### Modification

1. Clic "Modifier" → `/delivery/customers/:id/edit`
2. Pré-remplissage avec `selectedCustomer`
3. Clic "Enregistrer" → dispatch `updateCustomer`
4. Effect → API → Success : toast + navigation `/delivery/customers/:id`

### Suppression

1. Clic "Supprimer" → Dialog de confirmation
2. Si `hasActiveOrders = true` → bouton désactivé
3. Confirmation → dispatch `deleteCustomer`
4. Effect → API → Success : toast + navigation liste + refresh

---

## 📦 Livrables

### Code

- Store NgRx complet (state, actions, reducer, effects, selectors)
- 4 composants (list, detail, form, delete-dialog)
- `CustomerService`

### Routes avec guards

```typescript
canActivate: [AuthGuard, RoleGuard]
```

### Documentation

- Architecture NgRx
- Schéma flux de données

---

## ✅ Critères de réussite

- ✅ CRUD complet fonctionnel via NgRx
- ✅ Pagination/recherche/tri opérationnels
- ✅ Validation client + serveur
- ✅ Suppression bloquée si commandes actives
- ✅ Aucun appel direct au service (tout via Effects)
- ✅ Indicateurs de chargement pour chaque opération
- ✅ Messages clairs (succès/erreur)
- ✅ Navigation fluide
- ✅ Code maintenable et extensible

---

## 📝 Notes

Ce module constitue le modèle de référence pour l'implémentation NgRx dans SupplyChainX. Son architecture et ses patterns seront répliqués dans les autres modules du système.

---

**Version :** 1.0  
**Dernière mise à jour :** Janvier 2025