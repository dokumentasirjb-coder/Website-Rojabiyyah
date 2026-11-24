<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    {{-- CSRF Token --}}
    <meta name="csrf-token" content="{{ csrf_token() }}" />

    {{-- SEO & Meta Defaults --}}
    <meta name="description" content="Portal berita dan informasi umum Rojabiyyah." />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Rojabiyyah" />
    <meta property="og:locale" content="id_ID" />

    <title>Rojabiyyah — Portal Berita & Informasi Umum</title>

    {{-- Favicon --}}
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />

    {{-- Vite Scripts & Styles --}}
    @vite(['resources/css/app.css', 'resources/js/app.ts'])
</head>
<body class="min-h-screen bg-slate-50 text-slate-800 antialiased">
    <div id="app"></div>
</body>
</html>
