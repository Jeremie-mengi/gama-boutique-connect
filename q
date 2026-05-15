[33mcommit c5f50cc37b402e9fdecf679f0f29252deda3a619[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mWinLuyeye[m[33m)[m
Author: Winner luyeye <winnerluyeye1@gmail.com>
Date:   Tue May 12 02:07:48 2026 +0100

    feat: complete dynamic integration of boutique and article management with Zustand
    
    New features:
    - Full Zustand store integration for boutique management
    - Added CRUD actions (create, update, delete) in boutique store
    - Automatic userId retrieval from auth store
    - Dynamic article loading via getAllArticles()
    
    Major changes:
    - BoutiquesManager: migrated from props to Zustand store
    - BoutiqueSelector: removed props, direct store usage
    - ArticlesSection: connected to store for articles and boutiques
    - InventaireSection: connected to store for inventory data
    
    Store updates (boutiqueStore.ts):
    - Added updateBoutique and deleteBoutique methods
    - Implemented auto userId retrieval for creation
    - Optimistic delete updates
    - Full typing (CreateBoutiqueDTO, UpdateBoutiqueDTO)
    
    UI/UX improvements:
    - Loading states with Loader2 spinner
    - Error handling with toasts
    - Button disabling during async operations
    - Auto-refresh after CRUD operations
    
    Refactoring:
    - Removed props drilling (boutiques, articles, setArticles)
    - Centralized data in stores
    - Simplified components
    
    Technical improvements:
    - Used getState() for store access
    - Authentication checks before operations
    - Optimized re-renders with useMemo
    - Promise handling with try/catch
    
    Cleanup:
    - Removed obsolete mockData imports
    - Removed unused props
    - Standardized naming conventions
    
    Performance:
    - Automatic data caching in store
    - Reduced API calls with optimistic updates
    - Optimized flatMap for article retrieval
    
    Breaking changes:
    - Components no longer receive boutiques/articles props
    - Requires Zustand stores usage
    - userId is now automatically injected

[33mcommit b57706e8937c8f7dc182d8776ac599c4c8d2caa1[m[33m ([m[1;31morigin/WinLuyeye[m[33m)[m
Author: Winner luyeye <winnerluyeye1@gmail.com>
Date:   Tue May 12 01:08:58 2026 +0100

    refactor(dashboard): replace mock user with authenticated backend user
    
    - connect dashboard to zustand auth store
    - display real connected user name and role
    - remove currentMockUser dependency
    - improve logout flow with auth store cleanup
    - normalize role handling with backend values

[33mcommit 03dea924f6d47bd078c3b878c010e1fd90bc1fce[m
Author: Winner luyeye <winnerluyeye1@gmail.com>
Date:   Mon May 11 23:42:58 2026 +0100

    feat(auth): implement full authentication system
    
    - add zustand auth store with persistence and 7-day session support
    - integrate axios api client with env-based baseURL
    - replace fetch with axios in login flow
    - add remember me functionality
    - add password visibility toggle
    - improve auth UX and error handling

[33mcommit d399f7757dbc265434b52f09d465fdaf520d8953[m
Author: Winner luyeye <winnerluyeye1@gmail.com>
Date:   Mon May 11 22:18:05 2026 +0100

    Feat: refact auth (login) page

[33mcommit facb5c3da033a10caa26f11c2c7e8d9c60660617[m[33m ([m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m, [m[1;32mmain[m[33m)[m
Merge: e90b7bd 0de19ae
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 8 14:19:55 2026 +0000

    Ajouté dossier, QR et Excel
    
    X-Lovable-Edit-ID: edt-660ef117-9e02-40ce-8dc4-6b9891b7618c
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 0de19ae53306d44836a526f1054aa05ad0dd062e[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 8 14:19:36 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit cb7af53a94ad78bdefee05696575159e05305e89[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 8 14:19:05 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 8ccacfc863a059c98995161b74f61964aad2a33a[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 8 14:18:37 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit bcc8f5078c17cb875d31f93cfc85a3f90c943704[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 8 14:18:18 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 42c2a8145454db807a3f0271d7fea98962164269[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 8 14:17:58 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit cca3dd9b62202df0c0afc4139f5b19da3baf3612[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 8 14:17:30 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit e90b7bd8fe694397d9a363d2f835c618379bb230[m
Merge: c25c9f0 00722d8
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:53:28 2026 +0000

    Rétabli l'admin et créé route Vendeur
    
    X-Lovable-Edit-ID: edt-d5a8c19f-0809-4c09-a895-9e28ed4f4228
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 00722d871780ce8ad1a2ba98fa67f4f846a808e2[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:53:21 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 4e52be89d8ee175cb95db43e5497bf183cb10379[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:53:14 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 5233e44187b70841935b2b90f3bb315508a6ab74[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:53:09 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit e41cc9d44072faae2b55138eb107c7c6c3937cf5[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:53:03 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 11d0c444f154536763f1e96900832d6cfd3b8def[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:52:51 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 7bb6ae4e3b4e4f24cf63f04c476a8c66b7245b42[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:52:37 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit e21da3a7d1487bd284783c3345437ed032ee2930[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:52:27 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit c25c9f060b79433020fc5b17178f3fed8ade8d11[m
Merge: bbd09c2 351effd
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:42:09 2026 +0000

    Créé l'interface vendeur
    
    X-Lovable-Edit-ID: edt-08427ad7-3255-47a9-a6b3-c36ed2cf8410
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 351effd43e9fae000dc4faabf4e7fda5e0f5fe10[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:42:01 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit c9c7c8d54b33d88b5a24e417067e0e0d3685de15[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:41:38 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit cb17e900fd01ba746ec4880166e1f822a21a498e[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:41:25 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit b488c66884b26ec511301342bb86dbdc14084f76[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Tue May 5 16:41:18 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit bbd09c215c452f8b74a58c029e96188fdabf5adf[m
Merge: 845da96 aa61bb8
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:37:06 2026 +0000

    Ajouté lightbox et champs user
    
    X-Lovable-Edit-ID: edt-31d4c395-d1d3-4f1d-8b1f-ba31aacb9a41
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit aa61bb80abbae73b6c06383a56b8e5ed5143cf26[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:36:59 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 8869323bb0088f284b159ff050ccba861995e49d[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:36:49 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 5e847f6a1a36656069986cf39020abe5cfa29215[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:36:20 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 58cd73bc0d3cac8ec424b8f6fb5a8d0635f1acf2[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:35:56 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 845da961012d33f530ec3301722ffd8641a1215b[m
Merge: c89c651 c35c5a7
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:31:23 2026 +0000

    Ajouté PDF et Excel dans les export
    
    X-Lovable-Edit-ID: edt-d054faa1-4719-497d-a219-56ac1dfb8330
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit c35c5a7bc3fc46097d75d94cf04aca1f499249ea[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:31:12 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 81cb9ed8dd2186ead5e33a69fead232c7f0cc652[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:30:47 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit f76965323d99b0cbba30237def133cc8d67983c2[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:30:39 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit e0c37ae25d5f7a27aa259ac3e9864cf453f69c44[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:30:29 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 5a4e83860aa1f95c6a1e70fa553c1f919d7e928c[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:29:42 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit c4b5be87938d019d812bb762a78ee99e88301d68[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:29:32 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 65317c37e6c8737caccbdeb1f3aa3fb1f793eee2[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:28:50 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 313c50d46c3b9f3336cd690d17e73e0db2e542a5[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Sun May 3 23:28:38 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit c89c6516159d780130a51bb066a2ed30bb6da474[m
Merge: ad33e21 ce204c2
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 1 18:30:38 2026 +0000

    Ajouté PDF, lightbox et ventes
    
    X-Lovable-Edit-ID: edt-830a7bd6-fedb-4f17-b688-9c56040a986c
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit ce204c207634c85e29a78cbdd20dd9d503244d25[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 1 18:30:25 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 4ab71a2d63b0ddb7ca1bf3579a44c95a1743569e[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 1 18:30:10 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 11ae71d8284106b69c8a12dbfec8bc3a8328e46b[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 1 18:29:58 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit a64643dd4c56c3cbfc561fefd0db5e3a295cd99a[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 1 18:29:41 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit e478b16bbbd565bbce0a10355bcdf306e2895860[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 1 18:29:22 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit c05634cb6cba0bcc4d7fbd282d639c9f64782fab[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 1 18:29:08 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit 145afe0cb319b5520c2c403d2bddd2fda8e9a6f4[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 1 18:28:48 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit ab268cbfa2a6968fafd3e75520091c68c45d9ef7[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 1 18:28:26 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>

[33mcommit f7b0b1af872829693a31fc187772a4a34747f743[m
Author: gpt-engineer-app[bot] <159125892+gpt-engineer-app[bot]@users.noreply.github.com>
Date:   Fri May 1 18:28:15 2026 +0000

    Changes
    
    Co-authored-by: Jeremie-mengi <102491518+Jeremie-mengi@users.noreply.github.com>
