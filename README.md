# Warm up

## Tech Stack

| Component             | Tool/Library                            |
| --------------------- | --------------------------------------- |
| UI Framework          | Vue 3 + Composition API + TypeScript    |
| Styling               | Tailwind CSS + shadcn-vue               |
| Form Management       | VeeValidate + Zod for schema validation |
| Data Fetching & State | TanStack Query (Vue Query)              |
| Backend & DB          | Supabase (PostgreSQL + Storage)         |
| Notifications         | vue-sonner                              |
| Testing               | Vitest                                  |

## Features

- **Land Registration**: A form for citizens to submit new land parcel details, including an ownership proof document (image or PDF). All submissions are listed with their current status.
- **Land Transfers**: A dedicated page to initiate, update, and delete land transfers.
  - **Creation**: Form to specify recipient, parcel, and a signed contract file.
  - **Deletion**: Protected by a confirmation modal to prevent accidental removal.
  - **Updates**: Edit transfer details via a modal dialog.
- **Real-time UI**: The UI automatically reflects changes in data thanks to TanStack Query's cache invalidation.
- **User Feedback**: Toast notifications provide clear feedback for success and error states.
- **Robust Validation**: All forms feature strong, schema-based validation.
- **Unit Tested**: Core business logic in composables is covered by unit tests.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/irere123/warm-up.git
cd warm-up
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Your Environment

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and add your Supabase project URL and Anon Key. You can find these in your Supabase project's **Settings > API** section.

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Start the Application

```bash
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) to use the application.

## Running Tests

To run the unit tests for the composables, use the following command:

```bash
pnpm test:unit
```
# Land_vue
# Land_vue
