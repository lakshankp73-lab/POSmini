const db = new Dexie('HardwareDB');
// Define versions in order
db.version(2).stores({
    products: '++id, name, category, wholesalePrice, retailPrice, stockCount, unit, code, type'
}).upgrade(tx => {
    return tx.products.toCollection().modify(p => {
        if (!p.type) p.type = 'resale';
    });
});

db.version(3).stores({
    products: '++id, name, category, wholesalePrice, retailPrice, stockCount, unit, code, type',
    sales: '++id, date, totalAmount, discount, paymentMethod, items, customerId',
    customers: '++id, name, phone, creditBalance',
    suppliers: '++id, name, contact',
    settings: 'id, shopName, address, phone, headerMessage, footerMessage, logoUrl',
    notes: '++id, title, content, date'
});



const app = {
    state: {
        cart: [],
        currentView: 'dashboard',
        searchQuery: '',
        settings: null,
        language: localStorage.getItem('pos_lang') || 'en',
        isSidebarOpen: false,
        lowStockOnly: false,
        isCartOpen: false, // Mobile cart visibility
    },


    translations: {
        en: {
            // Sidebar
            nav_dashboard: "Overview",
            nav_pos: "Take Order",
            nav_inventory: "Menu / Dishes",
            nav_customers: "Tables / Guests",
            nav_suppliers: "Suppliers",
            nav_history: "Order History",
            nav_return: "Returns / Refunds",
            nav_settings: "Settings",
            nav_notes: "Kitchen Notes",
            backup_data: "Backup Data",

            restore_data: "Restore Data",

            // Dashboard
            dashboard_title: "Restaurant Overview",
            total_revenue: "Daily Revenue",
            low_stock_alerts: "Items Out of Stock",
            total_products: "Menu Items",
            recent_transactions: "Recent Orders",
            no_sales_today: "No orders yet today.",

            // POS
            pos_title: "Active Order",
            search_product_placeholder: "Search dishes or drinks...",
            cart_subtotal: "Subtotal",
            cart_discount: "Discount (LKR)",
            cart_customer: "Table / Guest",
            cart_payment: "Payment Type",
            cart_total: "Net Amount",
            checkout_btn: "Finalize & Print",
            cart_empty: "No dishes selected",
            walk_in_customer: "General Table",

            // Inventory
            inventory_title: "Menu Management",
            add_product: "Add Dish/Item",
            search_inventory_placeholder: "Search menu...",
            th_code: "Item ID",
            th_name: "Dish Name",
            th_category: "Category",
            th_stock: "Available",
            th_wholesale: "Cost Price",
            th_retail: "Selling Price",
            th_actions: "Actions",
            no_products: "No items in menu",

            // Customers
            customer_title: "Table Management",
            add_customer: "Add New Table",
            th_phone: "Section",
            th_credit: "Pending Bill",

            // Suppliers
            supplier_title: "Supplier Management",
            add_supplier: "Add Supplier",
            th_contact: "Contact",

            // History
            history_title: "Manage Orders",
            search_bill_placeholder: "Search Order ID...",
            th_bill_no: "Order #",
            th_date: "Date/Time",
            th_amount: "Total Amount",
            th_payment: "Method",

            // Settings
            settings_title: "Restaurant Settings",
            shop_name: "Restaurant Name",
            address: "Location",
            phone_number: "Phone",
            header_msg: "Receipt Header Message",
            footer_msg: "Receipt Footer Message",
            logo_upload: "Restaurant Logo",
            save_config: "Save Configuration",
            receipt_preview: "Bill Preview",

            // Modals
            add_new_product: "New Menu Item",
            edit_product: "Edit Dish",
            save_product: "Save Dish",
            save_btn: "Save",

            // Alerts
            confirm_delete_product: "Remove this dish from menu?",
            confirm_delete_bill: "Void this order?",
            sale_completed: "Order Completed!",
            product_saved: "Menu Updated!",
            p_code: "Dish ID",
            p_name: "Dish Name",
            p_unit: "Portion Type",
            no_records: "No records found.",
            loading: "Preparing...",
            pay_cash: "Cash",
            pay_card: "Card",
            pay_credit: "On-Hold",
            unit_pcs: "Portion (pcs)",
            unit_kg: "kg",
            unit_m: "Piece",
            unit_l: "Bottle",
            unit_bag: "Packet",
            unit_cube: "Plate",
            unit_can: "Cup",

            pay_cash: "Cash",
            pay_card: "Card",
            pay_credit: "Credit",
            unit_pcs: "portion",
            unit_kg: "kg",
            unit_m: "piece",
            unit_l: "bottle",
            unit_bag: "packet",
            unit_cube: "plate",
            unit_can: "cup",
            loading: "Loading...",

            // Errors & Toasts

            err_cart_empty: "No dishes selected!",
            err_select_cust_credit: "Please select a table for On-Hold orders!",
            toast_cust_added: "Table Added!",
            toast_supp_added: "Supplier Added!",
            toast_config_saved: "Settings Updated!",
            toast_backup_success: "Backup Successful!",
            toast_restore_success: "Data Restored!",
            err_restore_failed: "Restore Failed!",
            toast_bill_deleted: "Order #{0} Voided",
            toast_bill_loaded: "Order #{0} re-opened",
            confirm_delete_bill_msg: "Void Order #{0}? This will reset items and status.",
            confirm_edit_bill_msg: "Re-open Order #{0} for editing? This will void the original bill.",

            // ... (rest above)
            receipt_total: "TOTAL",

            // New Keys
            p_type: "Item Category",
            type_resale: "Retail Item",
            type_manufactured: "Kitchen Made",
            low_stock_only: "Unavailable Only",
            all_items: "All Items",
            no_results: "No matches found.",
            confirm_title: "Are you sure?",
            confirm_delete_msg: "This will remove the item permanently.",
            confirm_void_msg: "This will void the order. Proceed?",
            notes_title: "Kitchen Notes",
            add_note: "New Task/Note",
            th_title: "Topic",
            th_content: "Details",
            save_note: "Save Note",
            toast_note_saved: "Note Saved!",
            toast_note_deleted: "Note Deleted!",
            confirm_delete_note: "Delete this note?",
            return_title: "Process Returns & Refunds",
            search_order_id: "Enter Order Number (#)...",
            no_order_found: "Order not found. Check the ID.",
            return_items_btn: "Confirm Return & Refund",
            total_refund: "Total Refund Amount"

        },

        si: {
            // Sidebar
            nav_dashboard: "සාරාංශය",
            nav_pos: "ඇණවුම් ගැනීම",
            nav_inventory: "කෑම මෙනුව",
            nav_customers: "මේස අංක",
            nav_suppliers: "සැපයුම්කරුවන්",
            nav_history: "පැරණි ඇණවුම්",
            nav_return: "ආපසු ලබාගැනීම්",
            nav_settings: "සැකසුම්",
            nav_notes: "කුස්සියේ සටහන්",
            backup_data: "දත්ත සුරකින්න",

            restore_data: "දත්ත නැවත ගන්න",

            // Dashboard
            dashboard_title: "අද දින වාර්තාව",
            total_revenue: "අද දින ආදායම",
            low_stock_alerts: "ඉවර වී ඇති කෑම වර්ග",
            total_products: "මුළු කෑම වර්ග ගණන",
            recent_transactions: "මෑත ඇණවුම්",
            no_sales_today: "අද දින ඇණවුම් නොමැත.",

            // POS
            pos_title: "සක්‍රීය ඇණවුම",
            search_product_placeholder: "කෑම හෝ බීම සොයන්න...",
            cart_subtotal: "එකතුව",
            cart_discount: "වට්ටම් (රු)",
            cart_customer: "මේසය / අමුත්තා",
            cart_payment: "ගෙවන ආකාරය",
            cart_total: "මුළු මුදල",
            checkout_btn: "බිල්පත මුද්‍රණය කරන්න",
            cart_empty: "කෑම තෝරාගෙන නැත",
            walk_in_customer: "සාමාන්‍ය මේසයක්",

            // Inventory
            inventory_title: "මෙනු කළමනාකරණය",
            add_product: "අලුත් කෑමක්",
            search_inventory_placeholder: "කෑම වර්ග සොයන්න...",
            th_code: "කේතය",
            th_name: "නම",
            th_category: "වර්ගය",
            th_stock: "තිබේද?",
            th_wholesale: "පිරිවැය",
            th_retail: "මිල",
            th_actions: "ක්‍රියා",
            no_products: "මෙනුවේ කෑම නොමැත",

            // Customers
            customer_title: "මේස කළමනාකරණය",
            add_customer: "අලුත් මේසයක්",
            th_phone: "කොටස (Section)",
            th_credit: "ගෙවිය යුතු මුදල",

            // Suppliers
            supplier_title: "සැපයුම්කරුවන්",
            add_supplier: "අලුත් සැපයුම්කරුවෙක්",
            th_contact: "විස්තර",

            // History
            history_title: "ඇණවුම් විස්තර",
            search_bill_placeholder: "ඇණවුම් අංකය සොයන්න...",
            th_bill_no: "අංකය",
            th_date: "දිනය/වේලාව",
            th_amount: "වටිනාකම",
            th_payment: "ගෙවීම",

            // Settings
            settings_title: "පද්ධති සැකසුම්",
            shop_name: "අවන්හලේ නම",
            address: "ලිපිනය",
            phone_number: "දුරකථන අංකය",
            header_msg: "බිල්පතේ ඉහළ පණිවිඩය",
            footer_msg: "බිල්පතේ පහළ පණිවිඩය",
            logo_upload: "අවන්හලේ ලාංඡනය (Logo)",
            save_config: "සැකසුම් සුරකින්න",
            receipt_preview: "බිල්පතේ පෙනුම",

            // Modals
            add_new_product: "අලුත් කෑමක් එක් කරන්න",
            edit_product: "කෑම වෙනස් කරන්න",
            save_product: "සුරකින්න",
            save_btn: "සුරකින්න",
            notes_title: "කුස්සියේ සටහන්",
            add_note: "අලුත් සටහනක්",
            th_title: "මාතෘකාව",
            th_content: "විස්තරය",
            save_note: "සටහන සුරකින්න",
            toast_note_saved: "සටහන සුරැකිණි!",
            toast_note_deleted: "සටහන ඉවත් කරන ලදී!",
            confirm_delete_note: "ඔබට මෙම සටහන ඉවත් කිරීමට අවශ්‍යද?",


            // Alerts
            confirm_delete_product: "මෙම කෑම වර්ගය මෙනුවෙන් ඉවත් කරන්නද?",
            confirm_delete_bill: "මෙම ඇණවුම අවලංගු කරන්නද?",
            sale_completed: "ඇණවුම සාර්ථකයි!",
            product_saved: "මෙනුව යාවත්කාලීන විය!",
            p_code: "කේතය (ID)",
            p_name: "කෑමේ නම",
            p_unit: "ප්‍රමාණය (Portion)",
            no_records: "වාර්තා නොමැත.",
            loading: "සූදානම් වෙමින්...",
            pay_cash: "මුදල්",
            pay_card: "කාඩ්පත්",
            pay_credit: "රඳවා ඇති",
            unit_pcs: "පෝෂන්",
            unit_kg: "කිලෝ",
            unit_m: "කෑලි",
            unit_l: "බෝතල්",
            unit_bag: "පැකට්",
            unit_cube: "පිඟන්",
            unit_can: "කෝප්ප",

            // Errors & Toasts
            err_cart_empty: "කෑම තෝරාගෙන නැත!",
            err_select_cust_credit: "කරුණාකර මේස අංකයක් තෝරන්න!",
            toast_cust_added: "මේසය එක් කරන ලදී!",
            toast_supp_added: "සැපයුම්කරු එක් කරන ලදී!",
            toast_config_saved: "සැකසුම් සුරැකිණි!",
            toast_backup_success: "දත්ත සුරැකීම සාර්ථකයි!",
            toast_restore_success: "දත්ත නැවත පිහිටුවීම සාර්ථකයි!",
            err_restore_failed: "පිහිටුවීම අසාර්ථකයි!",
            toast_bill_deleted: "ඇණවුම් අංක #{0} අවලංගු කරන ලදී",
            toast_bill_loaded: "ඇණවුම් අංක #{0} සංස්කරණයට ගන්නා ලදී",
            confirm_delete_bill_msg: "ඇණවුම් අංක #{0} අවලංගු කරන්නද? මෙය සියලු දත්ත වෙනස් කරනු ඇත.",
            confirm_edit_bill_msg: "මෙය සංස්කරණය කිරීමට නම් පරණ බිල්පත අවලංගු කළ යුතුය. ඉදිරියට යන්නද?",

            // ... (rest above)
            receipt_total: "මුළු මුදල",

            // New Keys
            p_type: "කෑමේ වර්ගය",
            type_resale: "පිටතින් ගෙනෙන",
            type_manufactured: "කුස්සියේ සාදන",
            low_stock_only: "අවසන් වී ඇති දේ පමණි",
            all_items: "සියලුම වර්ග",
            no_results: "ප්‍රතිඵල නොමැත.",
            confirm_title: "ඔබට විශ්වාසද?",
            confirm_delete_msg: "මෙය මැකූ පසු නැවත ලබා ගත නොහැක.",
            confirm_void_msg: "මෙම ඇණවුම අවලංගු කරනු ඇත. ඉදිරියට යන්නද?",
            return_title: "ආපසු ලබාගැනීම් සහ මුදල් ගෙවීම්",
            search_order_id: "ඇණවුම් අංකය ඇතුළත් කරන්න (#)...",
            no_order_found: "ඇණවුම හමු නොවීය. අංකය පරීක්ෂා කරන්න.",
            return_items_btn: "ආපසු ලබාගැනීම ස්ථිර කරන්න",
            total_refund: "ආපසු ගෙවිය යුතු මුළු මුදල"
        }

    },

    t: (key, ...args) => {
        try {
            let text = app.translations[app.state.language][key] || key;
            args.forEach((arg, i) => {
                text = text.replace(`{${i}}`, arg);
            });
            return text;
        } catch (e) {
            return key;
        }
    },

    toggleSidebar: () => {
        const sidebar = document.getElementById('main-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (!sidebar) return;

        const isCurrentlyClosed = sidebar.classList.contains('-translate-x-full');

        if (isCurrentlyClosed) {
            // Opening
            sidebar.classList.remove('-translate-x-full');
            app.state.isSidebarOpen = true;
            if (overlay) {
                overlay.style.display = 'block';
                setTimeout(() => {
                    overlay.classList.remove('opacity-0');
                    overlay.classList.add('opacity-100');
                }, 10);
            }
        } else {
            // Closing
            sidebar.classList.add('-translate-x-full');
            app.state.isSidebarOpen = false;
            if (overlay) {
                overlay.classList.remove('opacity-100');
                overlay.classList.add('opacity-0');
                setTimeout(() => {
                    if (!app.state.isSidebarOpen) overlay.style.display = 'none';
                }, 300);
            }
        }
    },


    confirm: (options) => {
        return new Promise((resolve) => {
            const container = document.getElementById('custom-modal-container');
            const modal = document.getElementById('custom-modal');
            const title = document.getElementById('modal-title-text');
            const message = document.getElementById('modal-message-text');
            const icon = document.getElementById('modal-icon');
            const iconBg = document.getElementById('modal-icon-container');
            const confirmBtn = document.getElementById('modal-confirm-btn');
            const cancelBtn = document.getElementById('modal-cancel-btn');

            title.innerText = options.title || 'Confirm';
            message.innerText = options.message || 'Are you sure?';
            confirmBtn.innerText = options.confirmText || 'Confirm';
            cancelBtn.innerText = options.cancelText || 'Cancel';

            // Icon & Color set
            iconBg.className = `w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-xl ${options.type === 'danger' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/20 text-indigo-500'}`;
            icon.setAttribute('data-lucide', options.icon || 'alert-circle');
            lucide.createIcons();

            container.classList.add('active');
            modal.classList.remove('scale-90');
            modal.classList.add('scale-100');

            const handleResult = (result) => {
                container.classList.remove('active');
                modal.classList.remove('scale-100');
                modal.classList.add('scale-90');
                confirmBtn.onclick = null;
                cancelBtn.onclick = null;
                resolve(result);
            };

            confirmBtn.onclick = () => handleResult(true);
            cancelBtn.onclick = () => handleResult(false);
        });
    },


    toggleLanguage: (lang) => {
        app.state.language = lang;
        localStorage.setItem('pos_lang', lang);
        app.updateLanguageUI();
        app.navigate(app.state.currentView);
    },

    toggleTheme: () => {
        const body = document.body;
        body.classList.toggle('light-mode');
        app.updateThemeUI();
    },

    updateThemeUI: () => {
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('pos_theme', isLight ? 'light' : 'dark');

        // Update Toggle Buttons (Sidebar, Header, Settings)
        const updateBtn = (id, lightClass, darkClass) => {
            const btn = document.getElementById(id);
            if (btn) {
                if (isLight) {
                    btn.className = lightClass;
                    // Check if it's the settings one or sidebar one
                    if (id === 'theme-toggle-settings') btn.innerHTML = `<i data-lucide="moon" class="w-5 h-5"></i>`;
                } else {
                    btn.className = darkClass;
                    if (id === 'theme-toggle-settings') btn.innerHTML = `<i data-lucide="sun" class="w-5 h-5"></i>`;
                }
            }
        };

        updateBtn('theme-toggle-settings',
            "p-2 rounded-full bg-slate-200 text-slate-800 shadow-md hover:scale-110 transition-all",
            "p-2 rounded-full bg-slate-800 text-yellow-400 border border-slate-700 hover:scale-110 transition-all"
        );

        updateBtn('theme-toggle-header',
            "p-2.5 rounded-xl bg-white text-slate-800 shadow-xl active:scale-95",
            "p-2.5 rounded-xl bg-slate-800 text-yellow-400 shadow-xl active:scale-95"
        );

        const headerBtn = document.getElementById('theme-toggle-header');
        if (headerBtn) {
            headerBtn.innerHTML = isLight ? `<i data-lucide="moon" class="w-5 h-5"></i>` : `<i data-lucide="sun" class="w-5 h-5"></i>`;
        }

        // Sidebar Switch UI update
        const sidebarBtn = document.getElementById('theme-toggle-sidebar');
        if (sidebarBtn) {
            const dot = sidebarBtn.querySelector('.theme-switch-dot');
            const bg = sidebarBtn.querySelector('.theme-switch-bg');
            const sun = sidebarBtn.querySelector('.sun-icon');
            const moon = sidebarBtn.querySelector('.moon-icon');

            if (isLight) {
                dot.classList.add('translate-x-4');
                bg.classList.add('bg-indigo-500');
                bg.classList.remove('bg-slate-800');
                sun.classList.add('hidden');
                moon.classList.remove('hidden');
            } else {
                dot.classList.remove('translate-x-4');
                bg.classList.remove('bg-indigo-500');
                bg.classList.add('bg-slate-800');
                sun.classList.remove('hidden');
                moon.classList.add('hidden');
            }
        }


        lucide.createIcons();
    },




    updateLanguageUI: () => {
        const lang = app.state.language;
        document.getElementById('lang-en').className = `flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`;
        document.getElementById('lang-si').className = `flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${lang === 'si' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`;

        // Update Sidebar Text
        document.querySelector('#nav-dashboard span').innerText = app.t('nav_dashboard');
        document.querySelector('#nav-pos span').innerText = app.t('nav_pos');
        document.querySelector('#nav-inventory span').innerText = app.t('nav_inventory');
        document.querySelector('#nav-customers span').innerText = app.t('nav_customers');
        document.querySelector('#nav-suppliers span').innerText = app.t('nav_suppliers');
        document.querySelector('#nav-reports span').innerText = app.t('nav_history');
        const navReturn = document.querySelector('#nav-return span');
        if (navReturn) navReturn.innerText = app.t('nav_return');
        document.querySelector('#nav-settings span').innerText = app.t('nav_settings');

        // Update Sidebar Footer buttons
        const backupBtn = document.getElementById('btn-backup');
        if (backupBtn) backupBtn.innerHTML = `<i data-lucide="download" class="w-4 h-4"></i> ${app.t('backup_data')}`;

        const restoreBtn = document.getElementById('btn-restore');
        if (restoreBtn) restoreBtn.innerHTML = `<i data-lucide="upload" class="w-4 h-4"></i> ${app.t('restore_data')}`;

        lucide.createIcons();
    },

    init: async () => {
        // Load Settings
        const settings = await db.settings.get(1);
        if (!settings) {
            app.state.settings = {
                id: 1,
                shopName: 'THE TASTY HUB',
                address: '45, Food Street, Colombo',
                phone: '011-2345678',
                headerMessage: 'Fresh & Delicious Food',
                footerMessage: 'Thank You! Visit Us Again.',
                logoUrl: ''
            };
            await db.settings.add(app.state.settings);
        } else {
            app.state.settings = settings;
        }

        // Apply Theme
        const savedTheme = localStorage.getItem('pos_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }
        app.updateThemeUI();

        // Initial Data Seeding (Framework)
        const count = await db.products.count();
        if (count === 0) {
            await db.products.bulkAdd([
                { name: 'Chicken Rice & Curry', category: 'Main Menu', wholesalePrice: 350, retailPrice: 450, stockCount: 100, unit: 'cube', code: 'MC001', type: 'manufactured' },
                { name: 'Egg Fried Rice (Full)', category: 'Fried Rice', wholesalePrice: 400, retailPrice: 600, stockCount: 100, unit: 'cube', code: 'FR001', type: 'manufactured' },
                { name: 'Kottu Roti (Chicken)', category: 'Kottu', wholesalePrice: 500, retailPrice: 850, stockCount: 100, unit: 'cube', code: 'KT001', type: 'manufactured' },
                { name: 'Fresh Lime Juice', category: 'Beverages', wholesalePrice: 100, retailPrice: 180, stockCount: 50, unit: 'can', code: 'BV001', type: 'manufactured' },
                { name: 'Coca-Cola (500ml)', category: 'Beverages', wholesalePrice: 120, retailPrice: 150, stockCount: 24, unit: 'l', code: 'BV002', type: 'resale' },
            ]);
        }


        app.navigate('dashboard');
    },

    navigate: (view) => {
        try {
            app.state.currentView = view;
            const container = document.getElementById('app-container');
            if (!container) return;

            // Render Loading Immediately
            container.innerHTML = `<div class="animate-pulse flex items-center justify-center h-full text-slate-500">${app.t('loading')}</div>`;

            // Update Active Nav UI
            document.querySelectorAll('.nav-item').forEach(el => {
                el.classList.remove('bg-white/10', 'text-white', 'shadow-lg');
                el.classList.add('text-slate-400');
            });
            const activeNav = document.getElementById(`nav-${view}`);
            if (activeNav) {
                activeNav.classList.add('bg-white/10', 'text-white', 'shadow-lg');
                activeNav.classList.remove('text-slate-400');
            }

            // Theme UI update
            app.updateThemeUI();

            // Close sidebar on mobile
            const sidebar = document.getElementById('main-sidebar');
            if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
                app.toggleSidebar();
            }

            // Render Content
            setTimeout(async () => {
                try {
                    switch (view) {
                        case 'dashboard': await app.views.dashboard(container); break;
                        case 'pos': await app.views.pos(container); break;
                        case 'inventory': await app.views.inventory(container); break;
                        case 'customers': await app.views.customers(container); break;
                        case 'suppliers': await app.views.suppliers(container); break;
                        case 'reports': await app.views.reports(container); break;
                        case 'return': await app.views.return(container); break;
                        case 'notes': await app.views.notes(container); break;
                        case 'settings': await app.views.settings(container); break;

                    }
                    lucide.createIcons();
                } catch (err) {
                    console.error("View rendering failed:", err);
                    container.innerHTML = `<div class="p-8 text-center text-red-400">Error loading view. Please refresh.</div>`;
                }
            }, 50);
        } catch (e) {
            console.error("Navigation failed:", e);
        }
    },

    views: {
        dashboard: async (container) => {
            if (app.dashboardClockInterval) clearInterval(app.dashboardClockInterval);
            const productCount = await db.products.count();
            const lowStock = await db.products.where('stockCount').below(10).count();

            // Calculate Today's Sales
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const salesToday = await db.sales.where('date').aboveOrEqual(todayStart.getTime()).toArray();
            const totalRevenue = salesToday.reduce((sum, sale) => sum + sale.totalAmount, 0);

            container.innerHTML = `
                <div class="space-y-6 fade-in p-6">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent glow-text tracking-tight">${app.t('dashboard_title')}</h2>
                        <div class="flex items-center gap-3 text-sm font-medium bg-slate-800/50 px-5 py-2.5 rounded-full border border-slate-700/50 shadow-lg backdrop-blur-md">
                            <span class="text-slate-400 border-r border-slate-600 pr-3 mr-1">
                                ${new Date().toLocaleDateString(app.state.language === 'si' ? 'si-LK' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span id="dashboard-time" class="text-white font-mono font-bold tracking-widest text-base glow-text">
                                ${new Date().toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                    
                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div class="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                            <div class="flex justify-between items-start relative z-10">
                                <div>
                                    <p class="text-slate-400 text-sm font-medium uppercase tracking-wider">${app.t('total_revenue')}</p>
                                    <h3 class="text-3xl font-bold mt-2 text-white group-hover:scale-105 transition-transform origin-left">LKR ${totalRevenue.toLocaleString()}</h3>
                                    <p class="text-xs text-emerald-400 mt-1 flex items-center gap-1"><i data-lucide="trending-up" class="w-3 h-3"></i> Today's Earnings</p>
                                </div>
                                <div class="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10 group-hover:rotate-12 transition-transform duration-300">
                                    <i data-lucide="dollar-sign" class="w-8 h-8"></i>
                                </div>
                            </div>
                        </div>

                        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div class="absolute -right-6 -top-6 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all duration-500"></div>
                            <div class="flex justify-between items-start relative z-10">
                                <div>
                                    <p class="text-slate-400 text-sm font-medium uppercase tracking-wider">${app.t('low_stock_alerts')}</p>
                                    <h3 class="text-3xl font-bold mt-2 text-white group-hover:scale-105 transition-transform origin-left">${lowStock}</h3>
                                    <p class="text-xs ${lowStock > 0 ? 'text-red-400' : 'text-slate-500'} mt-1 flex items-center gap-1">
                                        ${lowStock > 0 ? `<i data-lucide="alert-circle" class="w-3 h-3"></i> Action Needed` : 'All Good'}
                                    </p>
                                </div>
                                <div class="p-3 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-xl text-pink-400 border border-pink-500/20 shadow-lg shadow-pink-500/10 group-hover:rotate-12 transition-transform duration-300">
                                    <i data-lucide="alert-triangle" class="w-8 h-8"></i>
                                </div>
                            </div>
                        </div>

                        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div class="absolute -right-6 -top-6 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all duration-500"></div>
                            <div class="flex justify-between items-start relative z-10">
                                <div>
                                    <p class="text-slate-400 text-sm font-medium uppercase tracking-wider">${app.t('total_products')}</p>
                                    <h3 class="text-3xl font-bold mt-2 text-white group-hover:scale-105 transition-transform origin-left">${productCount}</h3>
                                    <p class="text-xs text-slate-500 mt-1">In Menu</p>
                                </div>
                                <div class="p-3 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-xl text-teal-400 border border-teal-500/20 shadow-lg shadow-teal-500/10 group-hover:rotate-12 transition-transform duration-300">
                                    <i data-lucide="cooking-pot" class="w-8 h-8"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Charts & Recent Sales Split -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Chart Section -->
                         <div class="lg:col-span-2 glass-card p-6 rounded-2xl">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-xl font-bold text-white flex items-center gap-2">
                                    <i data-lucide="bar-chart-2" class="w-5 h-5 text-indigo-400"></i> Sales Analytics
                                </h3>
                                <select class="bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs px-3 py-1 text-slate-400 focus:outline-none hover:bg-slate-700/50 transition-colors cursor-pointer">
                                    <option>This Week</option>
                                    <option>This Month</option>
                                </select>
                            </div>
                            <div class="relative h-64 w-full">
                                <canvas id="salesChart"></canvas>
                            </div>
                        </div>

                        <!-- Recent Sales -->
                        <div class="glass-card p-6 rounded-2xl flex flex-col h-full">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-xl font-bold text-white flex items-center gap-2">
                                    <i data-lucide="history" class="w-5 h-5 text-pink-400"></i> ${app.t('recent_transactions')}
                                </h3>
                                <button onclick="app.navigate('reports')" class="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline">View All</button>
                            </div>
                            
                            <div class="overflow-y-auto pr-2 space-y-3 max-h-[300px] custom-scrollbar">
                                ${salesToday.length > 0 ? salesToday.slice(-5).reverse().map(sale => `
                                    <div class="group p-3 rounded-xl bg-slate-800/30 hover:bg-slate-700/40 border border-slate-700/30 hover:border-indigo-500/30 transition-all duration-300 cursor-default">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="font-mono text-xs text-slate-400 bg-slate-900/50 px-2 py-0.5 rounded">#${sale.id}</span>
                                            <span class="text-xs text-slate-500">${new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div class="flex justify-between items-end">
                                            <div>
                                                <div class="flex items-center gap-2">
                                                     <span class="w-2 h-2 rounded-full ${sale.paymentMethod === 'cash' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-blue-400 shadow-blue-400/50'} shadow-sm"></span>
                                                     <span class="text-sm text-slate-300 capitalize">${sale.paymentMethod}</span>
                                                </div>
                                            </div>
                                            <span class="font-bold text-white group-hover:text-emerald-400 transition-colors">LKR ${sale.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                `).join('') : `
                                    <div class="flex flex-col items-center justify-center h-40 text-slate-500 opacity-60">
                                        <i data-lucide="shopping-bag" class="w-10 h-10 mb-2"></i>
                                        <p class="text-sm">${app.t('no_sales_today')}</p>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Initialize Chart after DOM injection
            setTimeout(async () => {
                const ctx = document.getElementById('salesChart');
                if (ctx) {
                    // Get real data for the last 7 days
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const last7Days = [];
                    const salesData = [];

                    for (let i = 6; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        d.setHours(0, 0, 0, 0);
                        const dayName = days[d.getDay()];
                        last7Days.push(dayName);

                        const nextDay = new Date(d);
                        nextDay.setDate(d.getDate() + 1);

                        const daySales = await db.sales.where('date').between(d.getTime(), nextDay.getTime()).toArray();
                        salesData.push(daySales.reduce((s, sale) => s + sale.totalAmount, 0));
                    }

                    const isLight = document.body.classList.contains('light-mode');
                    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(148, 163, 184, 0.05)';
                    const textColor = isLight ? '#475569' : '#94a3b8';

                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: last7Days,
                            datasets: [{
                                label: 'Revenue (LKR)',
                                data: salesData,
                                borderColor: '#6366f1',
                                backgroundColor: isLight ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.1)',
                                borderWidth: 4,
                                pointBackgroundColor: '#6366f1',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: '#6366f1',
                                pointRadius: 4,
                                fill: true,
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    backgroundColor: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
                                    titleColor: isLight ? '#1e293b' : '#e2e8f0',
                                    bodyColor: isLight ? '#1e293b' : '#e2e8f0',
                                    borderColor: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)',
                                    borderWidth: 1,
                                    padding: 12,
                                    displayColors: false,
                                    callbacks: {
                                        label: function (context) {
                                            return 'LKR ' + context.parsed.y.toLocaleString();
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: { color: gridColor },
                                    ticks: { color: textColor, font: { family: 'Outfit', size: 10 } }
                                },
                                x: {
                                    grid: { display: false },
                                    ticks: { color: textColor, font: { family: 'Outfit', size: 10 } }
                                }
                            }
                        }
                    });

                }
            }, 100);


            // Start Dashboard Clock
            app.dashboardClockInterval = setInterval(() => {
                const timeEl = document.getElementById('dashboard-time');
                if (timeEl) {
                    timeEl.innerText = new Date().toLocaleTimeString();
                } else {
                    clearInterval(app.dashboardClockInterval);
                }
            }, 1000);
        },

        pos: async (container) => {
            const products = await db.products.toArray();
            const customers = await db.customers.toArray();

            container.innerHTML = `
                <div class="h-full flex flex-col md:flex-row overflow-hidden relative fade-in">
                    <!-- Left: Products Section -->
                    <div class="flex-1 flex flex-col overflow-hidden h-full">
                        <!-- Search & Filters -->
                        <div class="p-4 md:p-6 pb-2">
                             <div class="flex items-center gap-3">
                                <div class="relative flex-1 group">
                                    <i data-lucide="search" class="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors w-5 h-5"></i>
                                    <input type="text" id="pos-search" placeholder="${app.t('search_product_placeholder')}" 
                                        class="w-full bg-slate-900/40 border border-slate-700/50 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner backdrop-blur-md"
                                        oninput="app.handlers.posSearch(this.value)">
                                </div>
                                <button class="md:hidden p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 relative" onclick="app.handlers.toggleMobileCart()">
                                    <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                                    <span id="mobile-cart-badge" class="absolute -top-1 -right-1 bg-pink-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900">${app.state.cart.length}</span>
                                </button>
                             </div>
                        </div>

                        <!-- Product Grid -->
                        <div id="product-grid" class="flex-1 overflow-y-auto px-4 md:px-6 pb-24 md:pb-6 grid grid-cols-2 lg:grid-cols-4 gap-4 custom-scrollbar">
                            ${app.components.renderProductGrid(products)}
                        </div>
                    </div>

                    <!-- Right: Cart Section (Desktop Sidebar / Mobile Drawer) -->
                    <div id="pos-cart-container" class="w-full md:w-96 flex flex-col h-full bg-slate-900/95 md:bg-transparent border-l border-slate-700/50 shadow-2xl transition-all duration-300 transform fixed md:static inset-y-0 right-0 z-40 ${app.state.isCartOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}">
                        <!-- Drawer Header (Mobile only) -->
                        <div class="md:hidden p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 class="font-bold text-white flex items-center gap-2"><i data-lucide="shopping-cart" class="w-5 h-5 text-indigo-400"></i> ${app.t('pos_title')}</h3>
                            <button onclick="app.handlers.toggleMobileCart()" class="text-slate-400 hover:text-white"><i data-lucide="chevron-right" class="w-6 h-6"></i></button>
                        </div>
                        
                        <div class="hidden md:block p-6 pb-2">
                             <h3 class="font-bold text-xl flex items-center justify-between text-white">
                                <span class="flex items-center gap-2 italic tracking-tight"><i data-lucide="shopping-bag" class="w-6 h-6 text-indigo-400"></i> ${app.t('pos_title')}</span>
                             </h3>
                        </div>

                        <!-- Cart Items Container -->
                        <div id="cart-items-wrapper" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
                             <div id="cart-items" class="space-y-3">
                                <!-- Items injected here -->
                             </div>
                        </div>

                        <!-- Cart Totals & Actions -->
                        <div class="p-6 bg-slate-950/90 border-t border-slate-700/50 space-y-4 backdrop-blur-xl">
                            <div class="space-y-2 pb-4 border-b border-white/5">
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-400">${app.t('cart_subtotal')}</span>
                                    <span id="cart-subtotal" class="font-mono font-bold text-white">0.00</span>
                                </div>
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-slate-400 flex items-center gap-1"><i data-lucide="ticket" class="w-3.5 h-3.5"></i> ${app.t('cart_discount')}</span>
                                    <input type="number" id="cart-discount" value="0" min="0" 
                                        class="w-24 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-right text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                                        onchange="app.handlers.updateCartTotals()">
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label class="text-slate-500 uppercase font-black tracking-widest mb-1.5 block ml-1">${app.t('cart_customer')}</label>
                                    <div class="relative group">
                                        <select id="pos-customer" class="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none transition-all cursor-pointer">
                                            <option value="">${app.t('walk_in_customer')}</option>
                                            ${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                        </select>
                                        <i data-lucide="chevron-down" class="absolute right-3 top-3.5 w-4 h-4 text-slate-500 group-hover:text-indigo-400 pointer-events-none transition-colors"></i>
                                    </div>
                                </div>
                                <div>
                                    <label class="text-slate-500 uppercase font-black tracking-widest mb-1.5 block ml-1">${app.t('cart_payment')}</label>
                                    <div class="relative group">
                                        <select id="pos-payment" class="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none transition-all cursor-pointer">
                                            <option value="cash">${app.t('pay_cash')}</option>
                                            <option value="card">${app.t('pay_card')}</option>
                                            <option value="credit">${app.t('pay_credit')}</option>
                                        </select>
                                        <i data-lucide="chevron-down" class="absolute right-3 top-3.5 w-4 h-4 text-slate-500 group-hover:text-indigo-400 pointer-events-none transition-colors"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-between items-center pt-2">
                                <span class="text-slate-500 font-bold uppercase tracking-tighter text-sm">${app.t('cart_total')}</span>
                                <span id="cart-total" class="text-3xl font-black text-emerald-400 tracking-tighter">LKR 0.00</span>
                            </div>

                            <button onclick="app.handlers.checkout()" 
                                class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-3">
                                <i data-lucide="check-circle" class="w-6 h-6"></i>
                                ${app.t('checkout_btn')}
                            </button>
                        </div>
                    </div>


                    <!-- Mobile Cart Overlay -->
                    <div id="cart-overlay" onclick="app.handlers.toggleMobileCart()" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity flex md:hidden ${app.state.isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}"></div>
                </div>
            `;

            // Re-render cart items
            app.components.renderCart();

            // Re-initialize icons
            lucide.createIcons();

            // Restore UI state from pending edit if set
            if (app.state.pendingEdit) {
                const { customerId, discount } = app.state.pendingEdit;
                if (customerId) document.getElementById('pos-customer').value = customerId;
                if (discount) document.getElementById('cart-discount').value = discount;
                app.handlers.updateCartTotals();
                app.state.pendingEdit = null;
            }
        },

        inventory: async (container) => {
            const products = await db.products.toArray();
            container.innerHTML = `
                <div class="p-4 md:p-8 fade-in h-full flex flex-col">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div>
                            <h2 class="text-3xl font-black text-white italic tracking-tight">${app.t('inventory_title')}</h2>
                            <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage stock and product details</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-3">
                            <div class="relative group">
                                <i data-lucide="search" class="absolute left-3 top-2.5 text-slate-500 w-4 h-4 group-focus-within:text-indigo-400 transition-colors"></i>
                                <input type="text" placeholder="${app.t('search_inventory_placeholder')}" 
                                    class="bg-slate-900/50 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all w-64 shadow-inner"
                                    oninput="app.handlers.inventorySearch(this.value)">
                            </div>
                            <button onclick="app.handlers.toggleLowStockFilter()" id="low-stock-btn" class="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                                <i data-lucide="filter" class="w-3.5 h-3.5"></i> ${app.t('low_stock_only')}
                            </button>
                            <button onclick="app.handlers.openProductModal()" class="btn-premium text-white px-5 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i> ${app.t('add_product')}
                            </button>
                        </div>
                    </div>


                    <div class="glass rounded-xl overflow-hidden flex-1 flex flex-col">
                        <div class="overflow-auto flex-1">
                            <table class="w-full text-left text-sm text-slate-400">
                                <thead class="bg-slate-800 text-slate-200 uppercase text-xs sticky top-0">
                                    <tr>
                                        <th class="px-6 py-3 hidden md:table-cell">${app.t('th_code')}</th>
                                        <th class="px-6 py-3">${app.t('th_name')}</th>
                                        <th class="px-6 py-3 hidden lg:table-cell">${app.t('th_category')}</th>
                                        <th class="px-6 py-3 text-right">${app.t('th_stock')}</th>
                                        <th class="px-6 py-3 text-right hidden md:table-cell">${app.t('th_wholesale')}</th>
                                        <th class="px-6 py-3 text-right">${app.t('th_retail')}</th>
                                        <th class="px-6 py-3 text-center">${app.t('th_actions')}</th>
                                    </tr>

                                </thead>
                                <tbody id="inventory-table-body" class="divide-y divide-slate-700">
                                    ${app.components.renderInventoryRows(products)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Product Modal -->
                <div id="product-modal" class="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div class="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-hidden glass">
                        <div class="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                            <h3 id="modal-title" class="text-lg font-bold text-white">${app.t('add_new_product')}</h3>
                            <button onclick="document.getElementById('product-modal').classList.add('hidden')" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
                        </div>
                        <form id="product-form" onsubmit="app.handlers.saveProduct(event)" class="p-6 space-y-4">
                            <input type="hidden" id="p-id">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm text-slate-400 mb-1">${app.t('p_code')}</label>
                                    <input type="text" id="p-code" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-indigo-500 focus:outline-none">
                                </div>
                                <div>
                                    <label class="block text-sm text-slate-400 mb-1">${app.t('th_category')}</label>
                                    <input type="text" id="p-category" required class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-indigo-500 focus:outline-none">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm text-slate-400 mb-1">${app.t('p_name')}</label>
                                <input type="text" id="p-name" required class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-indigo-500 focus:outline-none">
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm text-slate-400 mb-1">${app.t('th_wholesale')}</label>
                                    <input type="number" id="p-wholesale" required class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-indigo-500 focus:outline-none">
                                </div>
                                <div>
                                    <label class="block text-sm text-slate-400 mb-1">${app.t('th_retail')}</label>
                                    <input type="number" id="p-retail" required class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-indigo-500 focus:outline-none">
                                </div>
                                <div>
                                    <label class="block text-sm text-slate-400 mb-1">${app.t('th_stock')}</label>
                                    <input type="number" id="p-stock" required class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-indigo-500 focus:outline-none">
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">${app.t('p_unit')}</label>
                                    <select id="p-unit" class="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none transition-colors">
                                        <option value="pcs">${app.t('unit_pcs')}</option>
                                        <option value="kg">${app.t('unit_kg')}</option>
                                        <option value="m">${app.t('unit_m')}</option>
                                        <option value="l">${app.t('unit_l')}</option>
                                        <option value="bag">${app.t('unit_bag')}</option>
                                        <option value="cube">${app.t('unit_cube')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">${app.t('p_type')}</label>
                                    <select id="p-type" class="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none transition-colors">
                                        <option value="resale">${app.t('type_resale')}</option>
                                        <option value="manufactured">${app.t('type_manufactured')}</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg mt-4 transition-colors">${app.t('save_product')}</button>
                        </form>
                    </div>
                </div>
            `;
        },

        customers: async (container) => {
            const customers = await db.customers.toArray();
            container.innerHTML = `
                <div class="p-8 fade-in h-full flex flex-col">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-white">${app.t('customer_title')}</h2>
                        <button onclick="app.handlers.openCustomerModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <i data-lucide="plus" class="w-4 h-4"></i> ${app.t('add_customer')}
                        </button>
                    </div>
                     <div class="glass rounded-xl overflow-hidden flex-1">
                        <table class="w-full text-left text-sm text-slate-400">
                            <thead class="bg-slate-800 text-slate-200 uppercase text-xs">
                                <tr>
                                    <th class="px-6 py-3">${app.t('th_name')}</th>
                                    <th class="px-6 py-3">${app.t('th_phone')}</th>
                                    <th class="px-6 py-3 text-right">${app.t('th_credit')}</th>
                                    <th class="px-6 py-3 text-center">${app.t('th_actions')}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-700">
                                ${customers.map(c => `
                                    <tr>
                                        <td class="px-6 py-4 font-medium text-white">${c.name}</td>
                                        <td class="px-6 py-4">${c.phone}</td>
                                        <td class="px-6 py-4 text-right font-bold text-red-400">${c.creditBalance > 0 ? 'LKR ' + c.creditBalance : '-'}</td>
                                        <td class="px-6 py-4 text-center">
                                           <button class="text-indigo-400 hover:text-indigo-300 mx-1"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Customer Modal -->
                <div id="customer-modal" class="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div class="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl glass">
                        <div class="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                            <h3 class="text-lg font-bold text-white">${app.t('add_customer')}</h3>
                            <button onclick="document.getElementById('customer-modal').classList.add('hidden')" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
                        </div>
                        <form onsubmit="app.handlers.saveCustomer(event)" class="p-6 space-y-4">
                            <div>
                                <label class="block text-sm text-slate-400 mb-1">${app.t('th_name')}</label>
                                <input type="text" id="c-name" required class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                            </div>
                            <div>
                                <label class="block text-sm text-slate-400 mb-1">${app.t('th_phone')}</label>
                                <input type="text" id="c-phone" required class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                            </div>
                            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg">${app.t('save_btn')}</button>
                        </form>
                    </div>
                </div>
            `;
        },

        suppliers: async (container) => {
            const suppliers = await db.suppliers.toArray();
            container.innerHTML = `
                <div class="p-8 fade-in h-full flex flex-col">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-white">${app.t('supplier_title')}</h2>
                        <button onclick="app.handlers.openSupplierModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <i data-lucide="plus" class="w-4 h-4"></i> ${app.t('add_supplier')}
                        </button>
                    </div>
                     <div class="glass rounded-xl overflow-hidden flex-1">
                        <table class="w-full text-left text-sm text-slate-400">
                            <thead class="bg-slate-800 text-slate-200 uppercase text-xs">
                                <tr>
                                    <th class="px-6 py-3">${app.t('th_name')}</th>
                                    <th class="px-6 py-3">${app.t('th_contact')}</th>
                                    <th class="px-6 py-3 text-center">${app.t('th_actions')}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-700">
                                ${suppliers.map(s => `
                                    <tr>
                                        <td class="px-6 py-4 font-medium text-white">${s.name}</td>
                                        <td class="px-6 py-4">${s.contact}</td>
                                        <td class="px-6 py-4 text-center">
                                           <button class="text-indigo-400 hover:text-indigo-300 mx-1"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Supplier Modal -->
                <div id="supplier-modal" class="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div class="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl glass">
                        <div class="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                            <h3 class="text-lg font-bold text-white">${app.t('add_supplier')}</h3>
                            <button onclick="document.getElementById('supplier-modal').classList.add('hidden')" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
                        </div>
                        <form onsubmit="app.handlers.saveSupplier(event)" class="p-6 space-y-4">
                            <div>
                                <label class="block text-sm text-slate-400 mb-1">${app.t('th_name')}</label>
                                <input type="text" id="s-name" required class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                            </div>
                            <div>
                                <label class="block text-sm text-slate-400 mb-1">${app.t('th_contact')}</label>
                                <input type="text" id="s-contact" required class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                            </div>
                            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg">${app.t('save_btn')}</button>
                        </form>
                    </div>
                </div>
            `;
        },

        reports: async (container) => {
            const sales = await db.sales.orderBy('date').reverse().limit(50).toArray();

            container.innerHTML = `
                <div class="p-8 fade-in h-full flex flex-col">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-white">${app.t('history_title')}</h2>
                        <div class="relative">
                            <i data-lucide="search" class="absolute left-3 top-3 text-slate-400 w-5 h-5"></i>
                            <input type="text" id="sales-search" placeholder="${app.t('search_bill_placeholder')}" 
                                class="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors w-64"
                                oninput="app.handlers.searchSales(this.value)">
                        </div>
                    </div>

                    <div class="glass rounded-xl overflow-hidden flex-1 flex flex-col">
                        <div class="overflow-auto flex-1">
                            <table class="w-full text-left text-sm text-slate-400">
                                <thead class="bg-slate-800 text-slate-200 uppercase text-xs sticky top-0">
                                    <tr>
                                        <th class="px-6 py-3">${app.t('th_bill_no')}</th>
                                        <th class="px-6 py-3">${app.t('th_date')}</th>
                                        <th class="px-6 py-3">${app.t('cart_customer')}</th>
                                        <th class="px-6 py-3 text-right">${app.t('th_amount')}</th>
                                        <th class="px-6 py-3 text-center">${app.t('th_payment')}</th>
                                        <th class="px-6 py-3 text-center">${app.t('th_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody id="sales-table-body" class="divide-y divide-slate-700">
                                    ${app.components.renderSalesRows(sales)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            lucide.createIcons();
        },

        return: async (container) => {
            container.innerHTML = `
                <div class="p-8 fade-in h-full flex flex-col items-center">
                    <div class="w-full max-w-2xl">
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent glow-text tracking-tight mb-8 text-center">${app.t('return_title')}</h2>
                        
                        <div class="glass-card p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6">
                            <div class="relative group">
                                <i data-lucide="search" class="absolute left-6 top-5 text-slate-500 w-6 h-6 group-focus-within:text-orange-500 transition-colors"></i>
                                <input type="number" id="return-search-id" placeholder="${app.t('search_order_id')}" 
                                    class="w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl pl-16 pr-6 py-5 text-white text-xl focus:outline-none focus:border-orange-500 transition-all shadow-inner">
                                <button onclick="app.handlers.searchReturnOrder()" class="absolute right-3 top-2.5 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-orange-500/20">
                                    Find
                                </button>
                            </div>

                            <div id="return-order-content" class="min-h-[200px] flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-3xl p-6">
                                <div class="text-center text-slate-500 italic">
                                    <i data-lucide="receipt" class="w-16 h-16 mx-auto mb-4 opacity-20"></i>
                                    <p>Enter an order number above to begin return process.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            lucide.createIcons();
        },

        notes: async (container) => {
            const notes = await db.notes.orderBy('date').reverse().toArray();
            container.innerHTML = `
                <div class="p-8 fade-in h-full flex flex-col">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent glow-text tracking-tight">${app.t('notes_title')}</h2>
                        <button onclick="app.handlers.openNoteModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                            <i data-lucide="plus" class="w-5 h-5"></i> ${app.t('add_note')}
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar">
                        ${notes.map(note => `
                            <div class="glass-card p-6 rounded-[2rem] border border-white/5 relative group hover:border-indigo-500/30 transition-all duration-300">
                                <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onclick="app.handlers.editNote(${note.id})" class="p-2 bg-slate-800/80 rounded-full text-indigo-400 hover:text-white transition-colors">
                                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                                    </button>
                                    <button onclick="app.handlers.deleteNote(${note.id})" class="p-2 bg-slate-800/80 rounded-full text-rose-400 hover:text-white transition-colors">
                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    </button>
                                </div>
                                <h3 class="text-xl font-bold text-white mb-2 pr-12">${note.title}</h3>
                                <p class="text-slate-400 text-sm whitespace-pre-wrap mb-4">${note.content}</p>
                                <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${new Date(note.date).toLocaleDateString()}</span>
                                    <i data-lucide="sticky-note" class="w-4 h-4 text-indigo-500/30"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    ${notes.length === 0 ? `
                        <div class="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-40">
                            <i data-lucide="sticky-note" class="w-24 h-24 mb-4"></i>
                            <p class="text-xl font-bold">No notes found</p>
                            <p class="text-sm">Keep track of your hardware stock tasks here.</p>
                        </div>
                    ` : ''}
                </div>

                <!-- Note Modal -->
                <div id="note-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                    <div class="glass-card w-full max-w-lg rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative">
                        <button onclick="app.handlers.closeNoteModal()" class="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                        <h3 id="note-modal-title" class="text-2xl font-black text-white mb-6 italic tracking-tight">${app.t('add_note')}</h3>
                        <form onsubmit="app.handlers.saveNote(event)" class="space-y-4">
                            <input type="hidden" id="note-id">
                            <div>
                                <label class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">${app.t('th_title')}</label>
                                <input type="text" id="note-title" required 
                                    class="w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner">
                            </div>
                            <div>
                                <label class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">${app.t('th_content')}</label>
                                <textarea id="note-content" required rows="6"
                                    class="w-full bg-slate-900/60 border border-slate-700/50 rounded-3xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner resize-none"></textarea>
                            </div>
                            <button type="submit" 
                                class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-3">
                                <i data-lucide="check-circle" class="w-6 h-6"></i>
                                ${app.t('save_note')}
                            </button>
                        </form>
                    </div>
                </div>
            `;
            lucide.createIcons();
        },


        settings: async (container) => {
            const s = app.state.settings;
            container.innerHTML = `
                <div class="p-4 md:p-8 fade-in h-full flex flex-col md:flex-row gap-6">
                    <!-- Form Section -->
                    <div class="flex-1 glass-card rounded-2xl overflow-hidden h-fit">
                        <div class="px-6 py-4 border-b border-slate-700/50 bg-slate-800/30">
                             <h3 class="text-xl font-bold text-white flex items-center justify-between">
                                <span class="flex items-center gap-2"><i data-lucide="settings" class="w-5 h-5 text-indigo-400"></i> ${app.t('settings_title')}</span>
                                <div class="flex items-center gap-3">
                                    <span class="text-xs text-slate-400 uppercase tracking-wider font-bold">Theme</span>
                                    <button onclick="app.toggleTheme()" id="theme-toggle-settings" 
                                        class="p-2 rounded-full ${document.body.classList.contains('light-mode') ? 'bg-white text-slate-800 shadow-md' : 'bg-slate-800 text-yellow-400 border border-slate-700'} hover:scale-110 transition-all">
                                        <i data-lucide="${document.body.classList.contains('light-mode') ? 'moon' : 'sun'}" class="w-5 h-5"></i>
                                    </button>
                                </div>
                            </h3>
                        </div>
                        <form onsubmit="app.handlers.saveSettings(event)" class="p-6 space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">${app.t('shop_name')}</label>
                                    <input type="text" id="st-name" value="${s.shopName}" oninput="app.handlers.updateSettingsPreview()" required 
                                        class="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner">
                                </div>
                                <div>
                                    <label class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">${app.t('phone_number')}</label>
                                    <input type="text" id="st-phone" value="${s.phone}" oninput="app.handlers.updateSettingsPreview()" required 
                                        class="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner">
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">${app.t('address')}</label>
                                <input type="text" id="st-address" value="${s.address}" oninput="app.handlers.updateSettingsPreview()" required 
                                    class="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">${app.t('header_msg')}</label>
                                    <input type="text" id="st-header" value="${s.headerMessage}" oninput="app.handlers.updateSettingsPreview()" 
                                        class="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner">
                                </div>
                                <div>
                                    <label class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">${app.t('footer_msg')}</label>
                                    <input type="text" id="st-footer" value="${s.footerMessage}" oninput="app.handlers.updateSettingsPreview()" 
                                        class="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner">
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">${app.t('logo_upload')}</label>
                                <div class="flex items-center gap-4 p-4 border border-dashed border-slate-700 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer relative group">
                                    <input type="file" id="logo_file" accept="image/*" onchange="app.handlers.handleLogoUpload(this)" class="absolute inset-0 opacity-0 cursor-pointer z-10"/>
                                    <div class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                        <i data-lucide="upload-cloud" class="w-5 h-5"></i>
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Click to upload logo</p>
                                        <p class="text-xs text-slate-500">Recommended: Black/White PNG, Transaprent</p>
                                    </div>
                                    <input type="hidden" id="st-logo" value="${s.logoUrl || ''}">
                                </div>
                            </div>
                            <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 mt-4">
                                ${app.t('save_config')}
                            </button>
                        </form>
                    </div>

                    <!-- Preview Section -->
                    <div class="w-full md:w-80 flex flex-col gap-4">
                        <h4 class="text-white font-bold opacity-80 uppercase tracking-widest text-xs ml-1">${app.t('receipt_preview')}</h4>
                        <div id="settings-preview" class="bg-white text-black p-4 font-mono text-xs shadow-2xl rotate-1 transform transition-all duration-500 hover:rotate-0 border-t-8 border-indigo-500 paper-texture">
                            ${app.components.renderReceiptPreview(s)}
                        </div>
                        <p class="text-xs text-slate-500 text-center">Preview of 58mm thermal receipt</p>
                    </div>
                </div>
            `;
        }
    },

    components: {
        renderProductGrid: (products) => {
            if (products.length === 0) return `<div class="col-span-full text-center text-slate-500 py-20 flex flex-col items-center"><i data-lucide="package-search" class="w-12 h-12 mb-3 opacity-50"></i>${app.t('no_products')}</div>`;
            return products.map(p => `
                <div onclick="app.handlers.addToCart(${p.id})" class="group bg-slate-800/40 hover:bg-slate-800/80 cursor-pointer rounded-2xl p-4 border border-slate-700/50 hover:border-indigo-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between h-48 relative overflow-hidden backdrop-blur-sm">
                    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="relative z-10">
                        <div class="flex justify-between items-start mb-2">
                             <span class="text-[10px] font-mono font-bold px-2 py-1 rounded bg-slate-900/50 text-slate-400 border border-slate-700/50 group-hover:border-indigo-500/30 transition-colors">${p.code || 'N/A'}</span>
                             <span class="text-[10px] font-bold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">${app.translations[app.state.language]['unit_' + p.unit] || p.unit}</span>
                        </div>
                        <h4 class="font-bold text-white text-lg leading-tight line-clamp-2 mb-1 group-hover:text-indigo-400 transition-colors">${p.name}</h4>
                        <p class="text-xs text-slate-500">${p.category}</p>
                    </div>
                    <div class="flex justify-between items-end relative z-10 mt-2">
                        <div>
                            <p class="text-[10px] text-slate-500 mb-0.5">Price</p>
                            <span class="text-emerald-400 font-bold text-xl tracking-tight">LKR ${p.retailPrice.toLocaleString()}</span>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg group-hover:shadow-indigo-500/30 group-hover:scale-110">
                            <i data-lucide="plus" class="w-5 h-5"></i>
                        </div>
                    </div>
                </div>
            `).join('');
        },

        renderInventoryRows: (products) => {
            if (products.length === 0) return `<tr><td colspan="7" class="p-8 text-center text-slate-500">${app.t('no_products')}</td></tr>`;
            return products.map(p => `
                <tr class="hover:bg-slate-700/30 transition-colors group">
                    <td class="px-6 py-4 font-mono text-xs text-slate-400 group-hover:text-indigo-400 transition-colors hidden md:table-cell">${p.code || '-'}</td>
                    <td class="px-6 py-4 font-medium text-white">${p.name}</td>
                    <td class="px-6 py-4 hidden lg:table-cell"><span class="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">${p.category}</span></td>
                    <td class="px-6 py-4 text-right font-bold ${p.stockCount < 10 ? 'text-rose-400' : 'text-emerald-400'}">${p.stockCount} <span class="text-[10px] text-slate-500 font-normal uppercase ml-1 md:inline hidden">${app.translations[app.state.language]['unit_' + p.unit] || p.unit}</span></td>
                    <td class="px-6 py-4 text-right text-slate-400 font-mono text-xs hidden md:table-cell">${p.wholesalePrice.toLocaleString()}</td>
                    <td class="px-6 py-4 text-right font-bold text-slate-200 font-mono">${p.retailPrice.toLocaleString()}</td>

                    <td class="px-6 py-4 text-center">
                        <div class="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onclick="app.handlers.editProduct(${p.id})" class="text-indigo-400 hover:text-white p-2 hover:bg-indigo-600 rounded-lg transition-all" title="Edit"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                            <button onclick="app.handlers.deleteProduct(${p.id})" class="text-rose-400 hover:text-white p-2 hover:bg-rose-600 rounded-lg transition-all" title="Delete"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
        },

        renderCart: () => {
            const container = document.getElementById('cart-items');
            if (!container) return;

            if (app.state.cart.length === 0) {
                container.innerHTML = `
                    <div class="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                        <div class="p-4 bg-slate-800/50 rounded-full mb-3">
                            <i data-lucide="shopping-cart" class="w-8 h-8 text-slate-400"></i>
                        </div>
                        <p>${app.t('cart_empty')}</p>
                        <p class="text-xs mt-1">Select items to start sale</p>
                    </div>
                `;
                app.handlers.updateCartTotals();
                lucide.createIcons();
                return;
            }

            container.innerHTML = app.state.cart.map((item, index) => `
                <div class="group flex items-center justify-between text-sm bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/80 transition-all relative overflow-hidden">
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="flex-1 pl-2">
                        <p class="font-bold text-white truncate w-28 group-hover:text-indigo-300 transition-colors">${item.name}</p>
                        <div class="flex items-center gap-2 mt-2">
                             <div class="flex items-center bg-slate-900/50 rounded-lg border border-slate-700/50">
                                <button onclick="app.handlers.updateCartQuantity(${index}, -1)" class="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-l-lg transition-colors">-</button>
                                <span class="px-2 text-xs text-white font-mono">${item.quantity}</span>
                                <button onclick="app.handlers.updateCartQuantity(${index}, 1)" class="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-r-lg transition-colors">+</button>
                             </div>
                             <span class="text-[10px] text-slate-500 uppercase">${app.translations[app.state.language]['unit_' + item.unit] || item.unit}</span>
                             <span class="text-xs text-slate-500 ml-auto">x ${item.price}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 ml-2">
                        <span class="font-mono font-bold text-emerald-400 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                        <button onclick="app.handlers.removeFromCart(${index})" class="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors" title="Remove Item">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            // Update mobile badge
            const badge = document.getElementById('mobile-cart-badge');
            if (badge) badge.innerText = app.state.cart.length;

            lucide.createIcons();
            app.handlers.updateCartTotals();
        },


        renderReceiptPreview: (s) => {
            return `
                <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
                    ${s.logoUrl ? `<img src="${s.logoUrl}" style="max-width: 60px; margin-bottom: 5px; display: block; margin: 0 auto; filter: grayscale(100%);">` : ''}
                    <h2 style="margin:5px 0 0; font-size: 18px; font-weight: 900; letter-spacing: 1px;">${s.shopName ? s.shopName.toUpperCase() : 'SHOP NAME'}</h2>
                    <p style="margin:2px 0; font-size: 12px; font-weight: 500;">${s.address || 'Address Line'}</p>
                    <p style="margin:0; font-size: 12px; font-weight: 500;">Tel: ${s.phone || '000-000000'}</p>
                    ${s.headerMessage ? `<p style="margin:5px 0 0; font-size: 11px; font-style: italic;">${s.headerMessage}</p>` : ''}
                </div>
                <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="text-align: left;">
                        <p style="margin:0; font-size: 12px;"><strong>INV:</strong> #1001</p>
                        <p style="margin:0; font-size: 12px;"><strong>DATE:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    <div style="text-align: right;">
                         <p style="margin:0; font-size: 12px;"><strong>TIME:</strong> ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                         <p style="margin:0; font-size: 12px;"><strong>CUST:</strong> General</p>
                    </div>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 12px;">
                    <thead style="border-top: 1px solid black; border-bottom: 1px solid black;">
                        <tr>
                            <th style="text-align: left; padding: 4px 0;">ITEM</th>
                            <th style="text-align: center; padding: 4px 0;">QTY</th>
                            <th style="text-align: right; padding: 4px 0;">AMT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding-top: 5px;">Chicken Rice & Curry</td>
                            <td style="text-align: center; padding-top: 5px;">2</td>
                            <td style="text-align: right; padding-top: 5px;">900.00</td>
                        </tr>
                        <tr>
                            <td>Fresh Lime Juice</td>
                            <td style="text-align: center;">1</td>
                            <td style="text-align: right;">180.00</td>
                        </tr>
                    </tbody>
                </table>
                <div style="border-top: 2px dashed black; padding-top: 5px;">
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; margin-top: 5px;">
                        <span>TOTAL:</span>
                        <span>Rs. 5200.00</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 2px;">
                         <span>Cash:</span>
                         <span>5200.00</span>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 15px; font-size: 11px;">
                    <p style="font-weight: bold;">${s.footerMessage || 'Thank You! Come Again.'}</p>
                    <p style="margin-top: 5px; font-size: 9px;">Powered by POSmini</p>
                </div>
            `;
        },

        renderSalesRows: (sales) => {
            if (sales.length === 0) return `<tr><td colspan="6" class="p-4 text-center text-slate-500">${app.t('no_records')}</td></tr>`;
            return sales.map(s => `
                <tr class="hover:bg-slate-700/50 transition-colors">
                    <td class="px-6 py-4 font-mono text-white">#${s.id}</td>
                    <td class="px-6 py-4">${new Date(s.date).toLocaleString()}</td>
                    <td class="px-6 py-4">${s.customerId ? 'Customer #' + s.customerId : 'Walk-in'}</td>
                    <td class="px-6 py-4 text-right font-bold text-emerald-400">LKR ${s.totalAmount.toLocaleString()}</td>
                    <td class="px-6 py-4 text-center">
                        <span class="px-2 py-1 rounded-full text-xs font-bold uppercase ${s.paymentMethod === 'cash' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}">
                            ${app.t('pay_' + s.paymentMethod)}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-center flex justify-center gap-3">
                        <button onclick="app.handlers.reprintSale(${s.id})" class="text-slate-400 hover:text-white" title="Reprint">
                            <i data-lucide="printer" class="w-4 h-4"></i>
                        </button>
                        <button onclick="app.handlers.editSale(${s.id})" class="text-indigo-400 hover:text-indigo-300" title="Edit (Void & Reload)">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button onclick="app.handlers.deleteSale(${s.id})" class="text-red-400 hover:text-red-300" title="Delete">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    },

    handlers: {
        posSearch: async (query) => {
            const products = await db.products.toArray();
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                (p.code && p.code.toLowerCase().includes(query.toLowerCase()))
            );
            document.getElementById('product-grid').innerHTML = app.components.renderProductGrid(filtered);
            lucide.createIcons();
        },

        inventorySearch: (query) => {
            app.state.searchQuery = query.toLowerCase();
            app.handlers.refreshInventoryTable();
        },

        toggleMobileCart: () => {
            app.state.isCartOpen = !app.state.isCartOpen;
            const cart = document.getElementById('pos-cart-container');
            const overlay = document.getElementById('cart-overlay');
            if (cart) {
                if (app.state.isCartOpen) {
                    cart.classList.remove('translate-x-full');
                    overlay.classList.remove('opacity-0', 'pointer-events-none');
                    overlay.classList.add('opacity-100');
                } else {
                    cart.classList.add('translate-x-full');
                    overlay.classList.add('opacity-0', 'pointer-events-none');
                    overlay.classList.remove('opacity-100');
                }
            }
        },

        openNoteModal: (id = null) => {
            const modal = document.getElementById('note-modal');
            if (!modal) return;
            const form = modal.querySelector('form');
            const titleInput = document.getElementById('note-title');
            const contentInput = document.getElementById('note-content');
            const idInput = document.getElementById('note-id');
            const modalTitle = document.getElementById('note-modal-title');

            if (id) {
                db.notes.get(id).then(note => {
                    idInput.value = note.id;
                    titleInput.value = note.title;
                    contentInput.value = note.content;
                    modalTitle.innerText = app.t('edit_product');
                });
            } else {
                form.reset();
                idInput.value = "";
                modalTitle.innerText = app.t('add_note');
            }

            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('opacity-100'), 10);
        },

        closeNoteModal: () => {
            const modal = document.getElementById('note-modal');
            if (!modal) return;
            modal.classList.remove('opacity-100');
            setTimeout(() => modal.classList.add('hidden'), 300);
        },

        saveNote: async (e) => {
            e.preventDefault();
            const id = document.getElementById('note-id').value;
            const note = {
                title: document.getElementById('note-title').value,
                content: document.getElementById('note-content').value,
                date: new Date().getTime()
            };

            if (id) {
                await db.notes.update(parseInt(id), note);
            } else {
                await db.notes.add(note);
            }

            app.handlers.closeNoteModal();
            app.navigate('notes');
            app.showToast(app.t('toast_note_saved'), 'success');
        },

        editNote: (id) => {
            app.handlers.openNoteModal(id);
        },

        deleteNote: async (id) => {
            if (await app.confirm({ title: app.t('confirm_title'), message: app.t('confirm_delete_note'), type: 'danger' })) {
                await db.notes.delete(id);
                app.navigate('notes');
                app.showToast(app.t('toast_note_deleted'), 'info');
            }
        },



        addToCart: async (id) => {
            const product = await db.products.get(id);
            if (!product) return;

            const existingItem = app.state.cart.find(i => i.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                app.state.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.retailPrice,
                    quantity: 1,
                    unit: product.unit
                });
            }
            // Trigger animation or feedback
            app.showToast(`Added ${product.name}`);
            app.components.renderCart();
        },

        updateCartQuantity: (index, change) => {
            if (app.state.cart[index]) {
                const newQty = app.state.cart[index].quantity + change;
                if (newQty > 0) {
                    app.state.cart[index].quantity = newQty;
                    app.components.renderCart();
                }
            }
        },

        removeFromCart: (index) => {
            app.state.cart.splice(index, 1);
            app.components.renderCart();
        },

        updateCartTotals: () => {
            const subtotal = app.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = parseFloat(document.getElementById('cart-discount')?.value || 0);
            const total = subtotal - discount;

            document.getElementById('cart-subtotal').innerText = subtotal.toFixed(2);
            document.getElementById('cart-total').innerText = total < 0 ? '0.00' : total.toFixed(2);
        },

        checkout: async () => {
            if (app.state.cart.length === 0) {
                app.showToast(app.t('err_cart_empty'), 'info');
                return;
            }

            const totalAmount = parseFloat(document.getElementById('cart-total').innerText);
            const discount = parseFloat(document.getElementById('cart-discount').value);
            const customerId = document.getElementById('pos-customer').value;
            const paymentMethod = document.getElementById('pos-payment').value;

            if (paymentMethod === 'credit' && !customerId) {
                app.showToast(app.t('err_select_cust_credit'), 'error');
                return;
            }

            const sale = {
                date: Date.now(),
                items: app.state.cart,
                totalAmount: totalAmount,
                discount: discount,
                paymentMethod: paymentMethod,
                customerId: customerId ? parseInt(customerId) : null
            };

            // Handle Credit Balance
            if (paymentMethod === 'credit' && customerId) {
                const customer = await db.customers.get(parseInt(customerId));
                await db.customers.update(parseInt(customerId), {
                    creditBalance: (customer.creditBalance || 0) + totalAmount
                });
            }

            // Update Stock
            for (const item of app.state.cart) {
                const product = await db.products.get(item.id);
                if (product) {
                    await db.products.update(item.id, {
                        stockCount: product.stockCount - item.quantity
                    });
                }
            }

            const saleId = await db.sales.add(sale);

            // Print Receipt
            app.printReceipt(sale, saleId);

            app.state.cart = [];
            app.components.renderCart();
            app.showToast(app.t('sale_completed'), 'success');
        },

        updateSettingsPreview: () => {
            const s = {
                shopName: document.getElementById('st-name').value || 'SHOP NAME',
                address: document.getElementById('st-address').value || 'Address',
                phone: document.getElementById('st-phone').value || 'Phone',
                headerMessage: document.getElementById('st-header').value,
                footerMessage: document.getElementById('st-footer').value,
                logoUrl: document.getElementById('st-logo').value
            };
            document.getElementById('settings-preview').innerHTML = app.components.renderReceiptPreview(s);
        },

        handleLogoUpload: (input) => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64Logo = e.target.result;
                    // Try both possible preview IDs
                    const preview1 = document.getElementById('logo_preview');
                    const preview2 = document.getElementById('st-logo-preview');
                    if (preview1) preview1.src = base64Logo;
                    if (preview2) preview2.src = base64Logo;

                    // Update state and temp hidden field
                    if (app.state.settings) app.state.settings.logoUrl = base64Logo;
                    const stLogo = document.getElementById('st-logo');
                    if (stLogo) stLogo.value = base64Logo;
                };
                reader.readAsDataURL(file);
            }
        },

        inventorySearch: (query) => {
            app.state.searchQuery = query.toLowerCase();
            app.handlers.refreshInventoryTable();
        },

        toggleLowStockFilter: () => {
            app.state.lowStockOnly = !app.state.lowStockOnly;
            const btn = document.getElementById('low-stock-btn');
            if (btn) {
                if (app.state.lowStockOnly) {
                    btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-500');
                    btn.classList.remove('bg-slate-800', 'text-slate-300');
                } else {
                    btn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-500');
                    btn.classList.add('bg-slate-800', 'text-slate-300');
                }
            }
            app.handlers.refreshInventoryTable();
        },

        refreshInventoryTable: async () => {
            let products = await db.products.toArray();

            if (app.state.searchQuery) {
                products = products.filter(p =>
                    p.name.toLowerCase().includes(app.state.searchQuery) ||
                    (p.code && p.code.toLowerCase().includes(app.state.searchQuery))
                );
            }

            if (app.state.lowStockOnly) {
                products = products.filter(p => p.stockCount <= 5);
            }

            const tbody = document.getElementById('inventory-table-body');
            if (tbody) {
                tbody.innerHTML = app.components.renderInventoryRows(products);
                lucide.createIcons();
            }
        },


        openProductModal: () => {
            document.getElementById('product-form').reset();
            document.getElementById('p-id').value = '';
            document.getElementById('modal-title').innerText = app.t('add_new_product');
            document.getElementById('product-modal').classList.remove('hidden');
        },

        saveProduct: async (e) => {
            e.preventDefault();
            const id = document.getElementById('p-id').value;
            const product = {
                name: document.getElementById('p-name').value,
                category: document.getElementById('p-category').value,
                wholesalePrice: parseFloat(document.getElementById('p-wholesale').value),
                retailPrice: parseFloat(document.getElementById('p-retail').value),
                stockCount: parseInt(document.getElementById('p-stock').value),
                unit: document.getElementById('p-unit').value,
                type: document.getElementById('p-type').value,
                code: document.getElementById('p-code').value || Math.random().toString(36).substr(2, 8).toUpperCase()
            };

            if (id) {
                await db.products.update(parseInt(id), product);
                app.showToast(app.t('toast_product_updated'), 'success');
            } else {
                await db.products.add(product);
                app.showToast(app.t('toast_product_added'), 'success');
            }

            document.getElementById('product-modal').classList.add('hidden');
            app.navigate('inventory');
        },

        deleteProduct: async (id) => {
            const confirmed = await app.confirm({
                title: app.t('confirm_title'),
                message: app.t('confirm_delete_msg'),
                type: 'danger',
                icon: 'trash-2',
                confirmText: 'Delete'
            });

            if (confirmed) {
                await db.products.delete(id);
                app.showToast(app.t('toast_product_deleted'));
                app.navigate('inventory');
            }
        },

        editProduct: async (id) => {
            const p = await db.products.get(id);
            if (!p) return;

            document.getElementById('p-id').value = p.id;
            document.getElementById('p-code').value = p.code || '';
            document.getElementById('p-category').value = p.category;
            document.getElementById('p-name').value = p.name;
            document.getElementById('p-wholesale').value = p.wholesalePrice;
            document.getElementById('p-retail').value = p.retailPrice;
            document.getElementById('p-stock').value = p.stockCount;
            document.getElementById('p-unit').value = p.unit;

            const typeEl = document.getElementById('p-type');
            if (typeEl) typeEl.value = p.type || 'resale';

            document.getElementById('modal-title').innerText = app.t('edit_product');
            document.getElementById('product-modal').classList.remove('hidden');
        },


        openCustomerModal: () => {
            document.getElementById('customer-modal').classList.remove('hidden');
        },

        saveCustomer: async (e) => {
            e.preventDefault();
            const customer = {
                name: document.getElementById('c-name').value,
                phone: document.getElementById('c-phone').value,
                creditBalance: 0
            };
            await db.customers.add(customer);
            document.getElementById('customer-modal').classList.add('hidden');
            app.navigate('customers');
            app.showToast(app.t('toast_cust_added'));
        },

        openSupplierModal: () => {
            document.getElementById('supplier-modal').classList.remove('hidden');
        },

        saveSupplier: async (e) => {
            e.preventDefault();
            const supplier = {
                name: document.getElementById('s-name').value,
                contact: document.getElementById('s-contact').value
            };
            await db.suppliers.add(supplier);
            document.getElementById('supplier-modal').classList.add('hidden');
            app.navigate('suppliers');
            app.showToast(app.t('toast_supp_added'));
        },

        saveSettings: async (e) => {
            e.preventDefault();
            const newSettings = {
                id: 1, // Always ID 1
                shopName: document.getElementById('st-name').value,
                phone: document.getElementById('st-phone').value,
                address: document.getElementById('st-address').value,
                headerMessage: document.getElementById('st-header').value,
                footerMessage: document.getElementById('st-footer').value,
                logoUrl: document.getElementById('st-logo').value
            };

            await db.settings.put(newSettings);
            app.state.settings = newSettings;
            app.showToast(app.t('toast_config_saved'), 'success');
        },

        searchSales: async (query) => {
            let sales;
            if (!query) {
                sales = await db.sales.orderBy('date').reverse().limit(50).toArray();
            } else {
                // Try searching by ID first
                if (!isNaN(query)) {
                    const s = await db.sales.get(parseInt(query));
                    sales = s ? [s] : [];
                } else {
                    // Fallback to searching all (inefficient but fine for small DB)
                    // In a real app we'd need better indexing
                    sales = await db.sales.filter(s =>
                        new Date(s.date).toLocaleDateString().includes(query)
                    ).toArray();
                }
            }
            document.getElementById('sales-table-body').innerHTML = app.components.renderSalesRows(sales);
            lucide.createIcons();
        },

        reprintSale: async (id) => {
            const sale = await db.sales.get(id);
            if (sale) app.printReceipt(sale, id);
        },

        deleteSale: async (id) => {
            const confirmed = await app.confirm({
                title: app.t('confirm_title'),
                message: app.t('confirm_void_msg'),
                type: 'danger',
                icon: 'alert-triangle',
                confirmText: 'Void Bill'
            });

            if (!confirmed) return;
            const sale = await db.sales.get(id);
            if (!sale) return;

            // 1. Restore Stock
            for (const item of sale.items) {
                const p = await db.products.get(item.id);
                if (p) {
                    await db.products.update(p.id, { stockCount: p.stockCount + item.quantity });
                }
            }

            // 2. Reverse Credit
            if (sale.paymentMethod === 'credit' && sale.customerId) {
                const c = await db.customers.where('name').equals(sale.customerId).first();
                if (c) {
                    await db.customers.update(c.id, { creditBalance: c.creditBalance - sale.totalAmount });
                }
            }

            // 3. Delete Sale
            await db.sales.delete(id);

            app.showToast(app.t('toast_bill_deleted', id));
            // Refresh list
            const query = document.getElementById('sales-search').value;
            app.handlers.searchSales(query);
        },

        editSale: async (id) => {
            const confirmed = await app.confirm({
                title: app.t('confirm_title'),
                message: app.t('confirm_edit_bill_msg', id),
                icon: 'edit-3',
                confirmText: 'Edit'
            });

            if (!confirmed) return;
            const sale = await db.sales.get(id);
            if (!sale) return;

            // 1. Restore Stock
            for (const item of sale.items) {
                const p = await db.products.get(item.id);
                if (p) {
                    await db.products.update(p.id, { stockCount: (p.stockCount || 0) + item.quantity });
                }
            }

            // 2. Reverse Credit
            if (sale.paymentMethod === 'credit' && sale.customerId) {
                const c = await db.customers.where('name').equals(sale.customerId).first();
                if (c) {
                    await db.customers.update(c.id, { creditBalance: (c.creditBalance || 0) - sale.totalAmount });
                }
            }

            // 3. Delete Sale
            await db.sales.delete(id);

            // 4. Load partial state to Cart
            app.state.cart = sale.items;

            // 5. Set pending edit state for POS view
            app.state.pendingEdit = {
                customerId: sale.customerId,
                discount: sale.discount
            };

            // 6. Navigate to POS
            app.navigate('pos');

            app.showToast(app.t('toast_bill_loaded', id), 'info');
        },

        searchReturnOrder: async () => {
            const idInput = document.getElementById('return-search-id');
            const id = parseInt(idInput.value);
            if (!id) return;

            const sale = await db.sales.get(id);
            const content = document.getElementById('return-order-content');

            if (!sale) {
                content.innerHTML = `<div class="text-red-400 font-bold flex flex-col items-center gap-2">
                    <i data-lucide="alert-circle" class="w-12 h-12"></i>
                    ${app.t('no_order_found')}
                </div>`;
                lucide.createIcons();
                return;
            }

            content.innerHTML = `
                <div class="w-full space-y-6 animate-in fade-in zoom-in duration-300">
                    <div class="flex justify-between items-center border-b border-white/10 pb-4">
                        <div>
                            <p class="text-slate-500 uppercase text-[10px] font-black tracking-widest mb-1">Order Details</p>
                            <h3 class="text-xl font-bold text-white flex items-center gap-2">
                                <span class="bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-lg text-sm">#${id}</span>
                                <span class="text-slate-300 text-sm font-medium">${new Date(sale.date).toLocaleString()}</span>
                            </h3>
                        </div>
                        <div class="text-right">
                            <p class="text-slate-500 uppercase text-[10px] font-black tracking-widest mb-1">Customer / Table</p>
                            <p class="text-white font-bold text-sm">${sale.customerId || app.t('walk_in_customer')}</p>
                        </div>
                    </div>

                    <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        ${sale.items.map((item, idx) => `
                            <div class="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-colors">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-orange-500 font-black border border-white/5">${item.quantity}</div>
                                    <div>
                                        <p class="text-white font-bold text-sm">${item.name}</p>
                                        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider">LKR ${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-white font-mono font-bold text-sm">LKR ${(item.price * item.quantity).toFixed(2)}</p>
                                    <label class="flex items-center gap-2 mt-1 cursor-pointer group">
                                        <span class="text-[9px] text-slate-500 group-hover:text-orange-400 transition-colors font-black uppercase tracking-tighter">Select for Return</span>
                                        <input type="checkbox" class="return-item-check w-4 h-4 rounded border-slate-700 bg-slate-900 text-orange-600 focus:ring-orange-500 focus:ring-offset-slate-900 transition-all cursor-pointer" data-index="${idx}">
                                    </label>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-3xl border border-orange-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div class="text-center md:text-left">
                            <p class="text-orange-500/60 uppercase text-[10px] font-black tracking-widest mb-1">${app.t('total_refund')}</p>
                            <p id="refund-total-display" class="text-3xl font-black text-white tracking-tighter">LKR 0.00</p>
                        </div>
                        <button onclick="app.handlers.processReturn(${id})" class="w-full md:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2">
                            <i data-lucide="check-circle" class="w-6 h-6"></i>
                            ${app.t('return_items_btn')}
                        </button>
                    </div>
                </div>
            `;

            // Add event listeners to checkboxes to update refund total
            const checks = document.querySelectorAll('.return-item-check');
            const totalDisplay = document.getElementById('refund-total-display');

            checks.forEach(check => {
                check.addEventListener('change', () => {
                    let total = 0;
                    checks.forEach(c => {
                        if (c.checked) {
                            const item = sale.items[parseInt(c.dataset.index)];
                            total += item.price * item.quantity;
                        }
                    });
                    totalDisplay.innerText = `LKR ${total.toFixed(2)}`;
                    if (total > 0) {
                        totalDisplay.classList.add('text-orange-400');
                        totalDisplay.classList.remove('text-white');
                    } else {
                        totalDisplay.classList.add('text-white');
                        totalDisplay.classList.remove('text-orange-400');
                    }
                });
            });

            lucide.createIcons();
        },

        processReturn: async (id) => {
            const checks = document.querySelectorAll('.return-item-check');
            const selectedIndices = Array.from(checks)
                .filter(c => c.checked)
                .map(c => parseInt(c.dataset.index));

            if (selectedIndices.length === 0) {
                app.showToast("Please select items to return", "error");
                return;
            }

            if (!confirm(app.t('confirm_void_msg'))) return;

            const sale = await db.sales.get(id);

            // Restock items
            for (const idx of selectedIndices) {
                const item = sale.items[idx];
                const product = await db.products.where('name').equals(item.name).first();
                if (product) {
                    await db.products.update(product.id, {
                        stockCount: product.stockCount + item.quantity
                    });
                }
            }

            // In this version, we void the whole bill if any items are returned for simplicity
            // or we could logic it to keep the remaining items, but usually Return means refunding the whole bill in simple POS.
            await db.sales.delete(id);

            app.showToast("Return Processed Successfully", "success");
            app.navigate('return');
        }
    },

    printReceipt: (sale, saleId) => {
        const printArea = document.getElementById('receipt-print-area');
        printArea.classList.remove('hidden');
        const s = app.state.settings;

        printArea.innerHTML = `
            <div style="width: 58mm; font-family: monospace; font-size: 12px; color: black; background: white;">
                <div style="text-align: center; border-bottom: 1px dashed black; padding-bottom: 5px; margin-bottom: 5px;">
                    ${s.logoUrl ? `<img src="${s.logoUrl}" style="max-width: 40px; margin-bottom: 5px; display: block; margin: 0 auto;">` : ''}
                    <h2 style="margin:0; font-size: 16px; font-weight: bold;">${s.shopName.toUpperCase()}</h2>
                    <p style="margin:0; font-size: 12px;">${s.address}</p>
                    <p style="margin:0; font-size: 12px;">Tel: ${s.phone}</p>
                    ${s.headerMessage ? `<p style="margin:2px 0; font-size: 11px;">${s.headerMessage}</p>` : ''}
                </div>
                <div style="margin-bottom: 5px;">
                    <p style="margin:0;">${app.t('receipt_invoice')}: #${saleId}</p>
                    <p style="margin:0;">${app.t('receipt_date')}: ${new Date(sale.date).toLocaleString()}</p>
                    <p style="margin:0;">${app.t('receipt_cust')}: ${sale.customerId ? sale.customerId : app.t('walk_in_customer')}</p>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
                    <tr style="border-bottom: 1px solid black;">
                        <th style="text-align: left;">${app.t('receipt_item')}</th>
                        <th style="text-align: right;">${app.t('receipt_qty')}</th>
                        <th style="text-align: right;">${app.t('receipt_amt')}</th>
                    </tr>
                    ${sale.items.map(item => `
                        <tr>
                            <td>${item.name.substring(0, 15)}</td>
                            <td style="text-align: right;">${item.quantity}</td>
                            <td style="text-align: right;">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </table>
                <div style="border-top: 1px dashed black; padding-top: 5px;">
                    ${sale.discount > 0 ? `<div style="display: flex; justify-content: space-between;"><span>${app.t('receipt_discount')}:</span> <span>-${sale.discount.toFixed(2)}</span></div>` : ''}
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-top: 2px;">
                        <span>${app.t('receipt_total')}:</span>
                        <span>Rs. ${sale.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 10px; font-size: 10px;">
                    <p>${s.footerMessage}</p>
                </div>
            </div>
        `;

        setTimeout(() => {
            window.print();
        }, 500);
    },

    showToast: (message, type = 'info') => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `px-4 py-2 rounded-lg text-white text-sm font-medium shadow-xl transform transition-all translate-y-2 opacity-0 flex items-center gap-2 ${type === 'success' ? 'bg-emerald-600' : 'bg-slate-700'}`;
        toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4"></i> ${message}`;
        container.appendChild(toast);
        lucide.createIcons();

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    backupData: async () => {
        const data = {
            products: await db.products.toArray(),
            sales: await db.sales.toArray(),
            customers: await db.customers.toArray(),
            suppliers: await db.suppliers.toArray(),
            settings: await db.settings.toArray()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pos_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        app.showToast(app.t('toast_backup_success'), 'success');
    },

    restoreData: async (input) => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);

                await db.transaction('rw', db.products, db.sales, db.customers, db.suppliers, db.settings, async () => {
                    await db.products.clear();
                    await db.sales.clear();
                    await db.customers.clear();
                    await db.suppliers.clear();
                    await db.settings.clear();

                    if (data.products) await db.products.bulkAdd(data.products);
                    if (data.sales) await db.sales.bulkAdd(data.sales);
                    if (data.customers) await db.customers.bulkAdd(data.customers);
                    if (data.suppliers) await db.suppliers.bulkAdd(data.suppliers);
                    if (data.settings) await db.settings.bulkAdd(data.settings);
                });

                app.showToast(app.t('toast_restore_success'), 'success');
                setTimeout(() => location.reload(), 1500);
            } catch (err) {
                console.error(err);
                app.showToast(app.t('err_restore_failed'), 'error');
            }
        };
        reader.readAsText(file);
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    app.initBarcodeScanner();
});

// Barcode Scanner Logic
app.initBarcodeScanner = () => {
    let buffer = '';
    let lastKeyTime = Date.now();
    const SCAN_TIMEOUT = 50; // ms between chars for scanner (very fast)

    document.addEventListener('keydown', (e) => {
        // Build buffer only if not focused on input/textarea
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        const char = e.key;
        const currentTime = Date.now();

        if (currentTime - lastKeyTime > SCAN_TIMEOUT) {
            buffer = ''; // Reset if too slow (likely manual typing)
        }

        lastKeyTime = currentTime;

        if (char === 'Enter') {
            if (buffer.length > 2) { // Minimum length check
                e.preventDefault();
                app.handleBarcodeScan(buffer);
            }
            buffer = '';
        } else if (char.length === 1) {
            buffer += char;
        }
    });
};

app.handleBarcodeScan = async (code) => {
    console.log("Scanned Code:", code);

    // Auto-navigate to POS if not already there (unless in Inventory)
    if (app.state.currentView !== 'pos' && app.state.currentView !== 'inventory') {
        app.navigate('pos');
        // Give time for view to load
        setTimeout(() => app.handleBarcodeScan(code), 300);
        return;
    }

    // Search for product by Code (Exact Match)
    const product = await db.products.where('code').equals(code).first();

    if (product) {
        if (app.state.currentView === 'pos') {
            await app.handlers.addToCart(product.id);
            app.showToast(`Scanned: ${product.name}`, 'success');

            // Play Beep Sound (Optional)
            const audio = new Audio('https://www.soundjay.com/buttons/sounds/beep-07.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed', e));

        } else if (app.state.currentView === 'inventory') {
            // In Inventory: Focus search and filter
            const searchInput = document.querySelector('input[placeholder*="Search"]');
            if (searchInput) {
                searchInput.value = code;
                searchInput.dispatchEvent(new Event('input'));
                searchInput.focus();
                app.showToast(`Found: ${product.name}`, 'info');
            }
        }
    } else {
        app.showToast(`Unknown Barcode: ${code}`, 'error');
        // Play Error Sound
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed', e));
    }
};
