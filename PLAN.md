## Plan Zadań: Nexo Frontend (Klon Jira)

Szczegółowy plan implementacji krok po kroku dla aplikacji frontendowej, oparty na możliwościach API `nexo-backend`. Backend obsługuje organizacje (multi-tenant), konfigurowalne tablice, kompleksowe śledzenie problemów (Epiki, Historyjki, Błędy, Zadania) oraz zarządzanie użytkownikami.

### Etapy Implementacji

**1. Faza 1: Uwierzytelnianie i Onboarding**
- Konfiguracja stanu uwierzytelniania JWT.
- Implementacja strony logowania.
- Implementacja rejestracji administratora (tworzenie pierwszej organizacji i konta admina).
- Implementacja rejestracji zaproszonych użytkowników.

**2. Faza 2: Zarządzanie Organizacją i Użytkownikami**
- *Zależy od Fazy 1*
- Implementacja widoku ustawień organizacji (Edycja / Usuwanie).
- Implementacja zarządzania użytkownikami (Lista członków, zapraszanie nowych przez API `/invitations`).
- Implementacja widoku profilu użytkownika.

**3. Faza 3: Zarządzanie Tablicami i Nawigacja**
- *Zależy od Fazy 1*
- Implementacja głównego paska nawigacji (Sidebar wyświetlający organizacje i dostępne tablice).
- Implementacja modalu tworzenia nowej tablicy (Tytuł, Opis).
- Implementacja ustawień tablicy (Aktualizacja / Usuwanie).

**4. Faza 4: Tablica Kanban (Rdzeń systemu)**
- *Zależy od Fazy 3*
- Widok obszaru roboczego mapujący etapy z backendu (`PREPARATION`, `TO_DO`, `IN_PROGRESS` itd.).
- Podpięcie biblioteki Drag and Drop (np. `dnd-kit` lub `@hello-pangea/dnd`) do przesuwania zadań.
- Implementacja komponentu Karty Zgłoszenia (Tytuł, Ikona typu, Priorytet, Awatar, Story Points).

**5. Faza 5: Operacje na Zgłoszeniach (CRUD)**
- *Zależy od Fazy 4*
- Implementacja modalu "Utwórz zgłoszenie" (Tytuł, Opis, Kryteria akceptacji, Typ, Priorytet, Story Points, Przypisanie, Daty).
- Implementacja szczegółów zgłoszenia ze wsparciem do odczytu i edycji po kliknięciu karty (Status, Opis, Komentarze, Linkowanie do epików).
- Opcja usuwania zgłoszeń.

**6. Faza 6: Backlog i Zaawansowane Filtrowanie**
- *Zależy od Fazy 5*
- Implementacja Backlogu dla tablicy (lista zadań nieprzypisanych jeszcze do aktywnego strumienia pracy).
- Dodanie rozbudowanego filtru na tablicy (Filtrowanie po użytkownikach, typach, priorytetach oraz wyszukiwanie tekstowe).
- Panel i moduł zarządzania Epikami.

### Struktura i wytyczne
- **Routing:** Aplikacja korzysta ze zintegrowanego routingu (np. `/login`, `/org/:id/board/:boardId`).
- **Komponenty UI:** Oparte o katalog `src/components/`, bazujące w większości na rozwiązaniach z rodziny Shadcn UI (`alert`, `avatar`, `card`, `dialog`, `sidebar`).
- **Połączenie API:** Komunikacja odbywa się przez globalnego interceptora wstrzykującego Bearer Token JWT do każdego żądania w `src/lib/`.