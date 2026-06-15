'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  img: string;
  tag?: string;
  details?: Record<string, string>;
  qtdOptions?: number[];
  category?: string;
}

export interface CartItem extends Product {
  qtd: number;
}

export type Language = 'pt' | 'en' | 'hi';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  pt: {
    // Navbar/Subnav/Common
    inicio: 'Início',
    loja: 'Loja',
    receitas: 'Receitas',
    contacto: 'Contacto/Apoio',
    localizacao: 'Localização',
    search_placeholder: 'Pesquisar produtos...',
    search_speak: 'Falar para pesquisar...',
    apoio: 'Apoio',
    conta: 'CONTA',
    cesto: 'CESTO',
    iniciar_sessao: 'Iniciar Sessão',
    registar: 'Registar',
    minhas_encomendas: 'As Minhas Encomendas',
    painel_visitas: 'Painel de Visitas',
    minhas_encomendas_painel: 'As Minhas Encomendas (Painel)',
    listening: 'A ouvir...',
    speech_not_supported: 'A pesquisa por voz não é suportada neste navegador.',
    speech_error: 'Erro na pesquisa por voz. Tente novamente.',

    // Categories
    todos: 'Todos',
    cereais: 'Cereais',
    vegetais: 'Vegetais',
    carnes: 'Carnes',
    mercearia: 'Mercearia',
    higiene: 'Higiene',
    bebidas: 'Bebidas',
    laticinios: 'Laticínios',
    leguminosas: 'Leguminosas',

    // Homepage
    hero_sub: 'Mercado do Zimpeto • Maputo',
    hero_title: 'Qualidade Bulk a Preços Justos',
    hero_desc: 'Fardos, frescos e mercearia. Directamente do Zimpeto para a sua porta.',
    hero_catalog: 'Ver Catálogo',
    hero_promos: 'Ver Promoções',
    usp_delivery: 'Entrega gratuita acima de 5.000 MT',
    usp_bulk: 'Fardos e produtos a granel',
    usp_location: 'Zimpeto, Maputo',
    usp_whatsapp: 'WhatsApp: +258 84 123 4567',
    promos_subtitle: 'Esta semana',
    promos_title: 'Promoção',
    promos_all: 'Ver tudo →',
    recipes_subtitle: 'Inspiração culinária',
    recipes_title: 'Receitas da Nossa Terra',
    recipes_all: 'Ver todas →',
    recipes_hover: 'Ver Receita',
    categories_subtitle: 'Navegue por',
    categories_title: 'Categorias',
    essentials_title: 'Outros Essenciais',
    essentials_btn: '+ Cesto',
    cta_title: 'Cozinhe como um Chef',
    cta_desc: 'Use a nossa base de frescos e mercearia para elevar o nível do seu negócio ou jantar familiar.',
    cta_btn: 'Explorar Receitas',
    add_to_cart_btn: 'Adicionar ao Cesto',

    // Loja Page
    catalog_wholesale: 'Zimpeto Wholesale',
    catalog_title: 'Catálogo Completo',
    filter_placeholder: 'Filtrar produtos...',
    filter_clear: 'Limpar',
    products_found: 'produtos encontrados',
    product_found: 'produto encontrado',
    sort_default: 'Ordenar: Destaque',
    sort_price_asc: 'Preço: Menor primeiro',
    sort_price_desc: 'Preço: Maior primeiro',
    sort_name: 'Nome A–Z',
    not_found_title: 'Nenhum produto encontrado',
    not_found_desc: 'Tente outra categoria ou termo de pesquisa',
    not_found_btn: 'Ver Todos os Produtos',
    add_to_cart_short: 'Adicionar +',

    // Receitas Page
    culinary_mz: 'Culinária Moçambicana',
    recipes_earth_title: 'Receitas da Nossa Terra',
    recipes_desc: 'Inspire-se com sabores tradicionais. Todos os ingredientes disponíveis na nossa loja.',
    back_recipes: '← Voltar às Receitas',
    ingredients_label: 'Ingredientes',
    preparation_label: 'Preparação',
    buy_ingredients_btn: 'Comprar Inredientes na Loja →',
    people_servings: 'pess.',
    recipe_detail_servings: 'pessoas',
    difficulty_facil: 'Fácil',
    difficulty_medio: 'Médio',
    recipe_detail_btn: 'Ver Receita →',

    // Contacto Page
    contact_title: 'Fale Connosco',
    contact_subtitle: 'Como podemos ajudar o seu negócio?',
    full_name_label: 'Nome Completo *',
    full_name_placeholder: 'Ex: João dos Santos',
    email_label: 'Endereço de Email *',
    email_placeholder: 'Ex: joao@exemplo.com',
    message_label: 'Mensagem *',
    message_placeholder: 'Como podemos ajudar o seu negócio?',
    send_message_btn: 'Enviar Mensagem',
    processing_btn: 'Processando...',
    verifying_btn: 'Verificando...',
    confirm_code_btn: 'Confirmar Código',
    resend_code_btn: 'Reenviar Código por Email',
    back_form_btn: '← Voltar ao Formulário',
    otp_sent_msg: 'Enviamos um código de verificação de 6 dígitos para o email',
    otp_enter_label: 'Introduza o Código OTP',
    test_mode_active: 'Modo de Teste Activo',
    code_generated: 'Código gerado',
    verification_completed: 'Verificação Concluída',
    message_sent_success: 'Mensagem enviada! Entraremos em contacto.',
    send_another_msg: 'Enviar outra mensagem',

    // Localizacao Page
    how_to_get: 'Como Chegar',
    location_title: 'Localização',
    morada_label: 'Morada',
    market_name: 'Mercado do Zimpeto',
    bancada_label: 'Bancada 42-B',
    horario_label: 'Horário',
    weekday_hours: 'Segunda – Sexta',
    saturday_hours: 'Sábado',
    sunday_hours: 'Domingo',
    sunday_closed: 'Fechado',
    transports_label: 'Transportes Próximos',
    transport_chapa27: 'Chapa 27 – Museu/Zimpeto',
    transport_chapa34: 'Chapa 34 – Baixa/Zimpeto',
    transport_parking: 'Estacionamento disponível no local',
    google_maps_btn: 'Abrir no Google Maps →',
    need_help_title: 'Precisa de Ajuda?',
    help_call_msg: 'Ligue ou envie mensagem antes de visitar para confirmar disponibilidade de stock.',

    // Checkout Page
    cesto_empty_title: 'O seu cesto está vazio',
    back_store_btn: 'Ir para a Loja',
    details_step: 'Detalhes',
    payment_step: 'Pagamento',
    shipping_info_title: 'Informações de Envio',
    delivery_tab: 'Entrega',
    pickup_tab: 'Levantamento (Pick Up)',
    telemovel: 'Telemóvel *',
    bairro_placeholder: 'Bairro *',
    rua_placeholder: 'Rua *',
    casa_placeholder: 'Nº da Casa',
    referencia_placeholder: 'Referência',
    pickup_location_title: 'Local de Levantamento:',
    pickup_schedule_msg: 'Horário de Funcionamento: Segunda – Sábado: 7h – 18h',
    continue_payment_btn: 'Continuar para Pagamento →',
    payment_method_title: 'Método de Pagamento',
    mpesa_instructions_1: '1. Envie o valor para: 84 000 0000 (Zimpeto Wholesale)',
    mpesa_instructions_2: '2. Após o envio, envie a confirmação de pagamento para: 84 000 0000 (Zimpeto Wholesale). E aguarde a nossa confirmação.',
    confirmation_code_placeholder: 'Codigo de Confirmação',
    agree_policies_label: 'Concordo com as políticas de venda',
    confirm_order_btn: 'Confirmar Encomenda →',
    processing_order_btn: 'Processando Encomenda...',
    order_summary_title: 'Resumo da Encomenda',
    total_label: 'Total',
    terminar_sessao: 'Terminar Sessão',
    ola: 'Olá, ',
    login_otp_title: 'Entrar com OTP',
    login_otp_desc: 'Insira o seu email para receber um código OTP de verificação.',
    send_otp: 'Enviar Código',
    verify_login: 'Confirmar e Entrar',
    invalid_otp: 'Código incorreto, expirado ou já utilizado.',
    email_required: 'Por favor, insira o seu email.',

    // Products
    'Arroz Don Pato (25kg)': 'Arroz Don Pato (25kg)',
    'Óleo Vegetal Somol (20L)': 'Óleo Vegetal Somol (20L)',
    'Leite UHT (12x1L)': 'Leite UHT (12x1L)',
    'Farinha de Trigo (50kg)': 'Farinha de Trigo (50kg)',
    'Farinha Milho (10kg)': 'Farinha Milho (10kg)',
    'Caixa Tomate (15kg)': 'Caixa Tomate (15kg)',
    'Açúcar Castanho (10kg)': 'Açúcar Castanho (10kg)',
    'Feijão Manteiga (5kg)': 'Feijão Manteiga (5kg)',
    'Batata Nacional (10kg)': 'Batata Nacional (10kg)',
    'Cebola Branca (10kg)': 'Cebola Branca (10kg)',
    'Detergente OMO (5kg)': 'Detergente OMO (5kg)',
    'Água (24x0.5L)': 'Água (24x0.5L)',
    'Sal Refinado (20kg)': 'Sal Refinado (20kg)',
    'Frango (fardo 10kg)': 'Frango (fardo 10kg)',

    // Recipes
    'Matapa Tradicional': 'Matapa Tradicional',
    'O prato mais icónico de Moçambique, feito com folhas de mandioca, amendoim e leite de coco.': 'O prato mais icónico de Moçambique, feito com folhas de mandioca, amendoim e leite de coco.',
    '500g folhas de mandioca piladas': '500g folhas de mandioca piladas',
    '200g amendoim torrado moído': '200g amendoim torrado moído',
    '400ml leite de coco': '400ml leite de coco',
    '300g camarão ou caranguejo': '300g camarão ou caranguejo',
    '4 dentes de alho': '4 dentes de alho',
    'Sal e piri-piri q.b.': 'Sal e piri-piri q.b.',
    'Lave as folhas de mandioca e deixa-as enxugar.': 'Lave as folhas de mandioca e deixa-as enxugar.',
    'Coloque em um pilão, o alho, o sal e as folhas de mandioca.': 'Coloque em um pilão, o alho, o sal e as folhas de mandioca.',
    'Pile muito bem de modo que as folhas fiquem amassadas completamente.': 'Pile muito bem de modo que as folhas fiquem amassadas completamente.',
    'Coloque tudo numa panela e deixe ferver por cerca de 30 minutos.': 'Coloque tudo numa panela e deixe ferver por cerca de 30 minutos.',
    'Coe o coco para obter o leite e reserve. Reserve também o amendoim pilado.': 'Coe o coco para obter o leite e reserve. Reserve também o amendoim pilado.',
    'Deite o leite de coco, juntamente com o amendoim pilado na matapa e o sal e deixa ferver durante algum tempo.': 'Deite o leite de coco, juntamente com o amendoim pilado na matapa e o sal e deixa ferver durante algum tempo.',
    'Junta o marisco.': 'Junta o marisco.',
    'Cozinha em lume brando por mais 30 minutos, mexendo sempre.': 'Cozinha em lume brando por mais 30 minutos, mexendo sempre.',
    'Tempera com sal e piri-piri. Serve com arroz branco.': 'Tempera com sal e piri-piri. Serve com arroz branco.',

    'Caril de Peixe': 'Caril de Peixe',
    'Caril aromático com peixe fresco, tomate e especiarias típicas moçambicanas.': 'Caril aromático com peixe fresco, tomate e especiarias típicas moçambicanas.',
    '650 g de tomate maduro': '650 g de tomate maduro',
    '500 ml de azeite': '500 ml de azeite',
    '150 ml de leite de coco': '150 ml de leite de coco',
    '100 ml de água ou caldo de legumes': '100 ml de água ou caldo de legumes',
    '4 postas de pescada': '4 postas de pescada',
    '2 cardamomos verdes': '2 cardamomos verdes',
    '2 dentes de alho': '2 dentes de alho',
    '2 limas': '2 limas',
    '1 colher de chá de gengibre em pó': '1 colher de chá de gengibre em pó',
    '1 colher de chá de caril': '1 colher de chá de caril',
    '1 colher de chá de coentros em pó': '1 colher de chá de coentros em pó',
    '1 colher de chá de sementes de mostarda': '1 colher de chá de sementes de mostarda',
    '1 ramo de coentros picados': '1 ramo de coentros picados',
    '1/2 colher de chá de açafrão das índias': '1/2 colher de chá de açafrão das índias',
    '1/2 malagueta': '1/2 malagueta',
    'Sal a gosto': 'Sal a gosto',
    'Tempere as postas de pescada com sal e sumo de uma lima. Reserve.': 'Tempere as postas de pescada com sal e sumo de uma lima. Reserve.',
    'Leve uma panela ao lume com o azeite, o gengibre, o açafrão, o coentro em pó, o caril, os cardamomos e as sementes de mostarda. Deixe cozinhar, mas continue mexendo.': 'Leve uma panela ao lume com o azeite, o gengibre, o açafrão, o coentro em pó, o caril, os cardamomos e as sementes de mostarda. Deixe cozinhar, mas continue mexendo.',
    'Junte os dentes de alho picados, a malagueta picada sem sementes, o tomate picado (sem pele e sem sementes) e a água ou o caldo de legumes. Deixe ferver, e mexe de vez em quando, até o tomate esteja bem cozido.': 'Junte os dentes de alho picados, a malagueta picada sem sementes, o tomate picado (sem pele e sem sementes) e a água ou o caldo de legumes. Deixe ferver, e mexe de vez em quando, até o tomate esteja bem cozido.',
    'Adicione as postas de pescada e o leite de coco.': 'Adicione as postas de pescada e o leite de coco.',
    'Rectifique o sal.': 'Rectifique o sal.',
    'Deixe cozinhar até o peixe esteja cozido.': 'Deixe cozinhar até o peixe esteja cozido.',
    'Regue o caril com um pouco de sumo de lima.': 'Regue o caril com um pouco de sumo de lima.',
    'Polvilhe com coentros frescos picados.': 'Polvilhe com coentros frescos picados.',
    'Sirva as postas de pescada com arroz branco.': 'Sirva as postas de pescada com arroz branco.',
    'Bom apetite.': 'Bom apetite.',

    'Frango Grelhado Piri-Piri': 'Frango Grelhado Piri-Piri',
    'Frango marinado em molho piri-piri caseiro, grelhado na brasa.': 'Frango marinado em molho piri-piri caseiro, grelhado na brasa.',
    '1 frango inteiro (cerca de 1,5 kg) cortado em partes (ou 4 coxas de frango, se preferir)': '1 frango inteiro (cerca de 1,5 kg) cortado em partes (ou 4 coxas de frango, se preferir)',
    '4 dentes de alho picados': '4 dentes de alho picados',
    '2 malaguetas vermelhas (ou a gosto)': '2 malaguetas vermelhas (ou a gosto)',
    '1 colher de chá de pimenta caiena (opcional, para aumentar o picante)': '1 colher de chá de pimenta caiena (opcional, para aumentar o picante)',
    '1 colher de chá de paprica doce': '1 colher de chá de paprica doce',
    '1 colher de sopa de vinagre de vinho branco': '1 colher de sopa de vinagre de vinho branco',
    '1 colher de sopa de azeite': '1 colher de sopa de azeite',
    '1 colher de sopa de sumo de limão': '1 colher de sopa de sumo de limão',
    '1 colher de chá de sal': '1 colher de chá de sal',
    '1 colher de chá de açúcar (opcional, para equilibrar o picante)': '1 colher de chá de açúcar (opcional, para equilibrar o picante)',
    '1 ramo de salsa (opcional, para decorar)': '1 ramo de salsa (opcional, para decorar)',
    'Num almofariz ou num processador de alimentos, triture os dentes de alho com as malaguetas, a pimenta caiena (se estiver a usar), a paprica, o vinagre, o azeite, o sumo de limão, o sal e o açúcar (se optar por usá-lo).': 'Num almofariz ou num processador de alimentos, triture os dentes de alho com as malaguetas, a pimenta caiena (se estiver a usar), a paprica, o vinagre, o azeite, o sumo de limão, o sal e o açúcar (se optar por usá-lo).',
    'Se gostar de uma marinada mais líquida, adicione um pouco mais de azeite ou vinagre até obter a consistência desejada.': 'Se gostar de uma marinada mais líquida, adicione um pouco mais de azeite ou vinagre até obter a consistência desejada.',
    'Prove e ajuste os temperos, adicionando mais piri-piri ou sal conforme o seu gosto.': 'Prove e ajuste os temperos, adicionando mais piri-piri ou sal conforme o seu gosto.',
    'Coloque o frango cortado em partes (ou as coxas, se for esse o caso) numa tigela grande.': 'Coloque o frango cortado em partes (ou as coxas, se for esse o caso) numa tigela grande.',
    'Regue o frango com a marinada de piri-piri, envolvendo bem para que todas as partes fiquem bem temperadas.': 'Regue o frango com a marinada de piri-piri, envolvendo bem para que todas as partes fiquem bem temperadas.',
    'Cubra com película aderente e deixe marinar no frigorífico durante pelo menos 2 horas (idealmente, de um dia para o outro para intensificar os sabores).': 'Cubra com película aderente e deixe marinar no frigorífico durante pelo menos 2 horas (idealmente, de um dia para o outro para intensificar os sabores).',
    'Aqueça a grelha ou a churrasqueira em temperatura média-alta.': 'Aqueça a grelha ou a churrasqueira em temperatura média-alta.',
    'Coloque o frango na grelha e cozinhe por cerca de 25 a 30 minutos, virando-o ocasionalmente para garantir que fica bem dourado e cozinhado por igual.': 'Coloque o frango na grelha e cozinhe por cerca de 25 a 30 minutos, virando-o ocasionalmente para garantir que fica bem dourado e cozinhado por igual.',
    'O frango deve estar completamente cozido por dentro, mas com a pele crocante e caramelizada.': 'O frango deve estar completamente cozido por dentro, mas com a pele crocante e caramelizada.',
    'Se estiver a usar uma grelha em casa, pode também grelhar na frigideira ou no forno, dependendo do equipamento disponível.': 'Se estiver a usar uma grelha em casa, pode também grelhar na frigideira ou no forno, dependendo do equipamento disponível.',
    'Depois de grelhado, retire o frango da grelha e deixe repousar uns minutos.': 'Depois de grelhado, retire o frango da grelha e deixe repousar uns minutos.',
    'Sirva o frango com uma salada fresca, batatas fritas ou arroz.': 'Sirva o frango com uma salada fresca, batatas fritas ou arroz.',
    'Decore com um pouco de salsa picada, se desejar, para dar um toque de frescor.': 'Decore com um pouco de salsa picada, se desejar, para dar um toque de frescor.',

    'Arroz de Coco': 'Arroz de Coco',
    'Arroz cremoso cozinhado em leite de coco, acompanhamento perfeito.': 'Arroz cremoso cozinhado em leite de coco, acompanhamento perfeito.',
    '2 chávenas de arroz': '2 chávenas de arroz',
    '2 chávenas de água': '2 chávenas de água',
    '1 colher de sal': '1 colher de sal',
    '1 pau de canela': '1 pau de canela',
    'Lava o arroz até a água sair limpa.': 'Lava o arroz até a água sair limpa.',
    'Mistura o leite de coco com a água e o sal.': 'Mistura o leite de coco com a água e o sal.',
    'Coloca o arroz e o pau de canela na panela.': 'Coloca o arroz e o pau de canela na panela.',
    'Cozinha em lume médio-baixo com tampa durante 20 min.': 'Cozinha em lume médio-baixo com tampa durante 20 min.',
    'Remove o pau de canela e serve.': 'Remove o pau de canela e serve.'
  },
  en: {
    // Navbar/Subnav/Common
    inicio: 'Home',
    loja: 'Store',
    receitas: 'Recipes',
    contacto: 'Contact/Support',
    localizacao: 'Location',
    search_placeholder: 'Search products...',
    search_speak: 'Speak to search...',
    apoio: 'Support',
    conta: 'ACCOUNT',
    cesto: 'CART',
    iniciar_sessao: 'Sign In',
    registar: 'Register',
    minhas_encomendas: 'My Orders',
    painel_visitas: 'Visit Dashboard',
    minhas_encomendas_painel: 'My Orders (Dashboard)',
    listening: 'Listening...',
    speech_not_supported: 'Voice search is not supported in this browser.',
    speech_error: 'Voice search error. Please try again.',

    // Categories
    todos: 'All',
    cereais: 'Grains',
    vegetais: 'Vegetables',
    carnes: 'Meats',
    mercearia: 'Groceries',
    higiene: 'Hygiene',
    bebidas: 'Beverages',
    laticinios: 'Dairy',
    leguminosas: 'Legumes',

    // Homepage
    hero_sub: 'Zimpeto Market • Maputo',
    hero_title: 'Bulk Quality at Fair Prices',
    hero_desc: 'Bundles, fresh goods, and groceries. Directly from Zimpeto to your doorstep.',
    hero_catalog: 'View Catalog',
    hero_promos: 'View Promotions',
    usp_delivery: 'Free delivery above 5,000 MT',
    usp_bulk: 'Wholesale and bulk products',
    usp_location: 'Zimpeto, Maputo',
    usp_whatsapp: 'WhatsApp: +258 84 123 4567',
    promos_subtitle: 'This week',
    promos_title: 'Promotions',
    promos_all: 'View all →',
    recipes_subtitle: 'Culinary inspiration',
    recipes_title: 'Recipes from Our Land',
    recipes_all: 'View all →',
    recipes_hover: 'View Recipe',
    categories_subtitle: 'Browse by',
    categories_title: 'Categories',
    essentials_title: 'Other Essentials',
    essentials_btn: '+ Cart',
    cta_title: 'Cook Like a Chef',
    cta_desc: 'Use our fresh and grocery staples to elevate your business or family dinner.',
    cta_btn: 'Explore Recipes',
    add_to_cart_btn: 'Add to Cart',

    // Loja Page
    catalog_wholesale: 'Zimpeto Wholesale',
    catalog_title: 'Complete Catalog',
    filter_placeholder: 'Filter products...',
    filter_clear: 'Clear',
    products_found: 'products found',
    product_found: 'product found',
    sort_default: 'Sort: Highlighted',
    sort_price_asc: 'Price: Lowest first',
    sort_price_desc: 'Price: Highest first',
    sort_name: 'Name A–Z',
    not_found_title: 'No products found',
    not_found_desc: 'Try another category or search term',
    not_found_btn: 'View All Products',
    add_to_cart_short: 'Add +',

    // Receitas Page
    culinary_mz: 'Mozambican Cuisine',
    recipes_earth_title: 'Recipes from Our Land',
    recipes_desc: 'Get inspired by traditional flavors. All ingredients available in our store.',
    back_recipes: '← Back to Recipes',
    ingredients_label: 'Ingredients',
    preparation_label: 'Preparation',
    buy_ingredients_btn: 'Buy Ingredients in Store →',
    people_servings: 'pess.',
    recipe_detail_servings: 'people',
    difficulty_facil: 'Easy',
    difficulty_medio: 'Medium',
    recipe_detail_btn: 'View Recipe →',

    // Contacto Page
    contact_title: 'Contact Us',
    contact_subtitle: 'How can we help your business?',
    full_name_label: 'Full Name *',
    full_name_placeholder: 'e.g. John Doe',
    email_label: 'Email Address *',
    email_placeholder: 'e.g. john@example.com',
    message_label: 'Message *',
    message_placeholder: 'How can we help your business?',
    send_message_btn: 'Send Message',
    processing_btn: 'Processing...',
    verifying_btn: 'Verifying...',
    confirm_code_btn: 'Confirm Code',
    resend_code_btn: 'Resend Code by Email',
    back_form_btn: '← Back to Form',
    otp_sent_msg: 'We sent a 6-digit verification code to the email',
    otp_enter_label: 'Enter OTP Code',
    test_mode_active: 'Test Mode Active',
    code_generated: 'Code generated',
    verification_completed: 'Verification Completed',
    message_sent_success: 'Message sent! We will be in touch.',
    send_another_msg: 'Send another message',

    // Localizacao Page
    how_to_get: 'How to Get Here',
    location_title: 'Location',
    morada_label: 'Address',
    market_name: 'Zimpeto Market',
    bancada_label: 'Stall 42-B',
    horario_label: 'Hours',
    weekday_hours: 'Monday – Friday',
    saturday_hours: 'Saturday',
    sunday_hours: 'Sunday',
    sunday_closed: 'Closed',
    transports_label: 'Nearby Transport',
    transport_chapa27: 'Chapa 27 – Museu/Zimpeto',
    transport_chapa34: 'Chapa 34 – Baixa/Zimpeto',
    transport_parking: 'Parking available on site',
    google_maps_btn: 'Open in Google Maps →',
    need_help_title: 'Need Help?',
    help_call_msg: 'Call or message us before visiting to confirm stock availability.',

    // Checkout Page
    cesto_empty_title: 'Your cart is empty',
    back_store_btn: 'Go to Store',
    details_step: 'Details',
    payment_step: 'Payment',
    shipping_info_title: 'Shipping Information',
    delivery_tab: 'Delivery',
    pickup_tab: 'Pick Up',
    telemovel: 'Phone Number *',
    bairro_placeholder: 'Neighborhood *',
    rua_placeholder: 'Street *',
    casa_placeholder: 'House No.',
    referencia_placeholder: 'Reference/Landmark',
    pickup_location_title: 'Pick Up Location:',
    pickup_schedule_msg: 'Hours of Operation: Monday – Saturday: 7am – 6pm',
    continue_payment_btn: 'Continue to Payment →',
    payment_method_title: 'Payment Method',
    mpesa_instructions_1: '1. Send the amount to: 84 000 0000 (Zimpeto Wholesale)',
    mpesa_instructions_2: '2. After sending, send the payment confirmation to: 84 000 0000 (Zimpeto Wholesale) and wait for our confirmation.',
    confirmation_code_placeholder: 'Confirmation Code',
    agree_policies_label: 'I agree to the sales policies',
    confirm_order_btn: 'Confirm Order →',
    processing_order_btn: 'Processing Order...',
    order_summary_title: 'Order Summary',
    total_label: 'Total',
    terminar_sessao: 'Logout',
    ola: 'Hello, ',
    login_otp_title: 'Login with OTP',
    login_otp_desc: 'Enter your email to receive an OTP verification code.',
    send_otp: 'Send Code',
    verify_login: 'Verify & Login',
    invalid_otp: 'Incorrect, expired, or already used code.',
    email_required: 'Please enter your email.',

    // Products
    'Arroz Don Pato (25kg)': 'Don Pato Rice (25kg)',
    'Óleo Vegetal Somol (20L)': 'Somol Vegetable Oil (20L)',
    'Leite UHT (12x1L)': 'UHT Milk (12x1L)',
    'Farinha de Trigo (50kg)': 'Wheat Flour (50kg)',
    'Farinha Milho (10kg)': 'Corn Flour (10kg)',
    'Caixa Tomate (15kg)': 'Tomato Box (15kg)',
    'Açúcar Castanho (10kg)': 'Brown Sugar (10kg)',
    'Feijão Manteiga (5kg)': 'Butter Beans (5kg)',
    'Batata Nacional (10kg)': 'National Potatoes (10kg)',
    'Cebola Branca (10kg)': 'White Onion (10kg)',
    'Detergente OMO (5kg)': 'OMO Detergent (5kg)',
    'Água (24x0.5L)': 'Water (24x0.5L)',
    'Sal Refinado (20kg)': 'Refined Salt (20kg)',
    'Frango (fardo 10kg)': 'Chicken (10kg bale)',

    // Recipes
    'Matapa Tradicional': 'Traditional Matapa',
    'O prato mais icónico de Moçambique, feito com folhas de mandioca, amendoim e leite de coco.': 'The most iconic Mozambican dish, made with cassava leaves, peanuts, and coconut milk.',
    '500g folhas de mandioca piladas': '500g ground cassava leaves',
    '200g amendoim torrado moído': '200g roasted ground peanuts',
    '400ml leite de coco': '400ml coconut milk',
    '300g camarão ou caranguejo': '300g shrimp or crab',
    '4 dentes de alho': '4 garlic cloves',
    'Sal e piri-piri q.b.': 'Salt and piri-piri to taste',
    'Lave as folhas de mandioca e deixa-as enxugar.': 'Wash the cassava leaves and let them dry.',
    'Coloque em um pilão, o alho, o sal e as folhas de mandioca.': 'Place garlic, salt, and cassava leaves in a mortar.',
    'Pile muito bem de modo que as folhas fiquem amassadas completamente.': 'Crush very well so that the leaves are completely mashed.',
    'Coloque tudo numa panela e deixe ferver por cerca de 30 minutos.': 'Put everything in a pot and let boil for about 30 minutes.',
    'Coe o coco para obter o leite e reserve. Reserve também o amendoim pilado.': 'Strain the coconut to get the milk and set aside. Also set aside the ground peanuts.',
    'Deite o leite de coco, juntamente com o amendoim pilado na matapa e o sal e deixa ferver durante algum tempo.': 'Pour the coconut milk, along with the ground peanuts and salt, into the matapa and let simmer for a while.',
    'Junta o marisco.': 'Add the seafood.',
    'Cozinha em lume brando por mais 30 minutos, mexendo sempre.': 'Cook on low heat for another 30 minutes, stirring constantly.',
    'Tempera com sal e piri-piri. Serve com arroz branco.': 'Season with salt and piri-piri. Serve with white rice.',

    'Caril de Peixe': 'Fish Curry',
    'Caril aromático com peixe fresco, tomate e especiarias típicas moçambicanas.': 'Aromatic curry with fresh fish, tomato, and typical Mozambican spices.',
    '650 g de tomate maduro': '650g ripe tomatoes',
    '500 ml de azeite': '500ml olive oil',
    '150 ml de leite de coco': '150ml coconut milk',
    '100 ml de água ou caldo de legumes': '100ml water or vegetable broth',
    '4 postas de pescada': '4 hake fillets',
    '2 cardamomos verdes': '2 green cardamoms',
    '2 dentes de alho': '2 garlic cloves',
    '2 limas': '2 limes',
    '1 colher de chá de gengibre em pó': '1 teaspoon ginger powder',
    '1 colher de chá de caril': '1 teaspoon curry powder',
    '1 colher de chá de coentros em pó': '1 teaspoon coriander powder',
    '1 colher de chá de sementes de mostarda': '1 teaspoon mustard seeds',
    '1 ramo de coentros picados': '1 bunch chopped coriander',
    '1/2 colher de chá de açafrão das índias': '1/2 teaspoon turmeric',
    '1/2 malagueta': '1/2 chili pepper',
    'Sal a gosto': 'Salt to taste',
    'Tempere as postas de pescada com sal e sumo de uma lima. Reserve.': 'Season hake fillets with salt and the juice of one lime. Set aside.',
    'Leve uma panela ao lume com o azeite, o gengibre, o açafrão, o coentro em pó, o caril, os cardamomos e as sementes de mostarda. Deixe cozinhar, mas continue mexendo.': 'Put a pot on heat with olive oil, ginger, turmeric, coriander powder, curry, cardamoms, and mustard seeds. Cook, stirring constantly.',
    'Junte os dentes de alho picados, a malagueta picada sem sementes, o tomate picado (sem pele e sem sementes) e a água ou o caldo de legumes. Deixe ferver, e mexe de vez em quando, até o tomate esteja bem cozido.': 'Add chopped garlic cloves, seeded chopped chili, chopped tomato (peeled and seeded), and water or vegetable broth. Bring to a boil and stir occasionally until tomatoes are well cooked.',
    'Adicione as postas de pescada e o leite de coco.': 'Add hake fillets and coconut milk.',
    'Rectifique o sal.': 'Adjust salt.',
    'Deixe cozinhar até o peixe esteja cozido.': 'Let cook until the fish is done.',
    'Regue o caril com um pouco de sumo de lima.': 'Drizzle the curry with some lime juice.',
    'Polvilhe com coentros frescos picados.': 'Sprinkle with fresh chopped coriander.',
    'Sirva as postas de pescada com arroz branco.': 'Serve hake fillets with white rice.',
    'Bom apetite.': 'Enjoy your meal.',

    'Frango Grelhado Piri-Piri': 'Grilled Piri-Piri Chicken',
    'Frango marinado em molho piri-piri caseiro, grelhado na brasa.': 'Chicken marinated in homemade piri-piri sauce, grilled on charcoal.',
    '1 frango inteiro (cerca de 1,5 kg) cortado em partes (ou 4 coxas de frango, se preferir)': '1 whole chicken (about 1.5 kg) cut into pieces (or 4 chicken thighs, if preferred)',
    '4 dentes de alho picados': '4 chopped garlic cloves',
    '2 malaguetas vermelhas (ou a gosto)': '2 red chili peppers (or to taste)',
    '1 colher de chá de pimenta caiena (opcional, para aumentar o picante)': '1 teaspoon cayenne pepper (optional, for extra heat)',
    '1 colher de chá de paprica doce': '1 teaspoon sweet paprika',
    '1 colher de sopa de vinagre de vinho branco': '1 tablespoon white wine vinegar',
    '1 colher de sopa de azeite': '1 tablespoon olive oil',
    '1 colher de sopa de sumo de limão': '1 tablespoon lemon juice',
    '1 colher de chá de sal': '1 teaspoon salt',
    '1 colher de chá de açúcar (opcional, para equilibrar o picante)': '1 teaspoon sugar (optional, to balance the heat)',
    '1 ramo de salsa (opcional, para decorar)': '1 sprig of parsley (optional, to garnish)',
    'Num almofariz ou num processador de alimentos, triture os dentes de alho com as malaguetas, a pimenta caiena (se estiver a usar), a paprica, o vinagre, o azeite, o sumo de limão, o sal e o açúcar (se optar por usá-lo).': 'In a mortar or food processor, grind the garlic cloves with the chilis, cayenne pepper (if using), paprika, vinegar, olive oil, lemon juice, salt, and sugar (if using).',
    'Se gostar de uma marinada mais líquida, adicione um pouco mais de azeite ou vinagre até obter a consistência desejada.': 'If you like a more liquid marinade, add a bit more olive oil or vinegar until you get the desired consistency.',
    'Prove e ajuste os temperos, adicionando mais piri-piri ou sal conforme o seu gosto.': 'Taste and adjust seasoning, adding more piri-piri or salt as you prefer.',
    'Coloque o frango cortado em partes (ou as coxas, se for esse o caso) numa tigela grande.': 'Place chicken pieces (or thighs) in a large bowl.',
    'Regue o frango com a marinada de piri-piri, envolvendo bem para que todas as partes fiquem bem temperadas.': 'Pour the piri-piri marinade over the chicken, tossing well to coat all pieces.',
    'Cubra com película aderente e deixe marinar no frigorífico durante pelo menos 2 horas (idealmente, de um dia para o outro para intensificar os sabores).': 'Cover with cling wrap and let marinate in the fridge for at least 2 hours (ideally, overnight to intensify flavors).',
    'Aqueça a grelha ou a churrasqueira em temperatura média-alta.': 'Preheat grill or barbecue to medium-high heat.',
    'Coloque o frango na grelha e cozinhe por cerca de 25 a 30 minutos, virando-o ocasionalmente para garantir que fica bem dourado e cozinhado por igual.': 'Place chicken on the grill and cook for about 25 to 30 minutes, turning occasionally to ensure it is evenly browned and cooked.',
    'O frango deve estar completamente cozido por dentro, mas com a pele crocante e caramelizada.': 'The chicken should be fully cooked inside, but with crispy and caramelized skin.',
    'Se estiver a usar uma grelha em casa, pode também grelhar na frigideira ou no forno, dependendo do equipamento disponível.': 'If you are using an indoor grill, you can also pan-fry or bake, depending on available equipment.',
    'Depois de grelhado, retire o frango da grelha e deixe repousar uns minutos.': 'Once grilled, remove chicken from the heat and let rest for a few minutes.',
    'Sirva o frango com uma salada fresca, batatas fritas ou arroz.': 'Serve chicken with a fresh salad, french fries, or rice.',
    'Decore com um pouco de salsa picada, se desejar, para dar um toque de frescor.': 'Garnish with some chopped parsley, if desired, for a touch of freshness.',

    'Arroz de Coco': 'Coconut Rice',
    'Arroz cremoso cozinhado em leite de coco, acompanhamento perfeito.': 'Creamy rice cooked in coconut milk, the perfect side dish.',
    '2 chávenas de arroz': '2 cups of rice',
    '2 chávenas de água': '2 cups of water',
    '1 colher de sal': '1 spoon of salt',
    '1 pau de canela': '1 cinnamon stick',
    'Lava o arroz até a água sair limpa.': 'Wash the rice until the water runs clear.',
    'Mistura o leite de coco com a água e o sal.': 'Mix coconut milk with water and salt.',
    'Coloca o arroz e o pau de canela na panela.': 'Put rice and cinnamon stick in the pot.',
    'Cozinha em lume médio-baixo com tampa durante 20 min.': 'Cook on medium-low heat covered for 20 min.',
    'Remove o pau de canela e serve.': 'Remove cinnamon stick and serve.'
  },
  hi: {
    // Navbar/Subnav/Common
    inicio: 'मुख्य पृष्ठ',
    loja: 'दुकान',
    receitas: 'रेसिपी',
    contacto: 'संपर्क/सहायता',
    localizacao: 'लोकेशन',
    search_placeholder: 'उत्पाद खोजें...',
    search_speak: 'खोजने के लिए बोलें...',
    apoio: 'सहायता',
    conta: 'खाता',
    cesto: 'कार्ट',
    iniciar_sessao: 'साइन इन',
    registar: 'रजिस्टर',
    minhas_encomendas: 'मेरे ऑर्डर',
    painel_visitas: 'विज़िट डैशबोर्ड',
    minhas_encomendas_painel: 'मेरे ऑर्डर (डैशबोर्ड)',
    listening: 'सुन रहे हैं...',
    speech_not_supported: 'इस ब्राउज़र में वॉयस सर्च समर्थित नहीं है।',
    speech_error: 'वॉयस सर्च त्रुटि। कृपया पुनः प्रयास करें।',

    // Categories
    todos: 'सभी',
    cereais: 'अनाज',
    vegetais: 'सब्जियां',
    carnes: 'मांस',
    mercearia: 'किराना',
    higiene: 'स्वच्छता',
    bebidas: 'पेय पदार्थ',
    laticinios: 'डेयरी',
    leguminosas: 'फलियां',

    // Homepage
    hero_sub: 'जिम्पेटो बाजार • मापुतो',
    hero_title: 'उचित मूल्य पर थोक गुणवत्ता',
    hero_desc: 'बंडल, ताजा सामान और किराना। सीधे जिम्पेटो से आपके दरवाजे तक।',
    hero_catalog: 'कैटलॉग देखें',
    hero_promos: 'प्रमोशन देखें',
    usp_delivery: '5,000 MT से अधिक पर मुफ्त डिलीवरी',
    usp_bulk: 'थोक और थोक उत्पाद',
    usp_location: 'जिम्पेटो, मापुतो',
    usp_whatsapp: 'WhatsApp: +258 84 123 4567',
    promos_subtitle: 'इस सप्ताह',
    promos_title: 'प्रमोशन',
    promos_all: 'सभी देखें →',
    recipes_subtitle: 'रसोई प्रेरणा',
    recipes_title: 'हमारी धरती के व्यंजन',
    recipes_all: 'सभी देखें →',
    recipes_hover: 'व्यंजन देखें',
    categories_subtitle: 'इसके अनुसार ब्राउज़ करें',
    categories_title: 'श्रेणियां',
    essentials_title: 'अन्य आवश्यक वस्तुएं',
    essentials_btn: '+ कार्ट',
    cta_title: 'एक शेफ की तरह पकाएं',
    cta_desc: 'अपने व्यवसाय या पारिवारिक रात्रिभोज को बेहतर बनाने के लिए हमारे ताज़ा और किराना स्टेपल का उपयोग करें।',
    cta_btn: 'व्यंजनों का अन्वेषण करें',
    add_to_cart_btn: 'कार्ट में जोड़ें',

    // Loja Page
    catalog_wholesale: 'जिम्पेटो थोक विक्रेता',
    catalog_title: 'पूर्ण कैटलॉग',
    filter_placeholder: 'उत्पाद फ़िल्टर करें...',
    filter_clear: 'साफ़ करें',
    products_found: 'उत्पाद मिले',
    product_found: 'उत्पाद मिला',
    sort_default: 'क्रमबद्ध करें: मुख्य',
    sort_price_asc: 'मूल्य: न्यूनतम पहले',
    sort_price_desc: 'मूल्य: उच्चतम पहले',
    sort_name: 'नाम A-Z',
    not_found_title: 'कोई उत्पाद नहीं मिला',
    not_found_desc: 'कोई अन्य श्रेणी या खोज शब्द आज़माएं',
    not_found_btn: 'सभी उत्पाद देखें',
    add_to_cart_short: 'जोड़ें +',

    // Receitas Page
    culinary_mz: 'मोज़ाम्बिकन भोजन',
    recipes_earth_title: 'हमारी धरती के व्यंजन',
    recipes_desc: 'पारंपरिक स्वादों से प्रेरित हों। हमारी दुकान में सभी सामग्री उपलब्ध है।',
    back_recipes: '← व्यंजनों पर वापस जाएं',
    ingredients_label: 'सामग्री',
    preparation_label: 'तैयारी',
    buy_ingredients_btn: 'दुकान में सामग्री खरीदें →',
    people_servings: 'लोग',
    recipe_detail_servings: 'लोग',
    difficulty_facil: 'आसान',
    difficulty_medio: 'मध्यम',
    recipe_detail_btn: 'व्यंजन देखें →',

    // Contacto Page
    contact_title: 'संपर्क करें',
    contact_subtitle: 'हम आपके व्यवसाय की कैसे मदद कर सकते हैं?',
    full_name_label: 'पूरा नाम *',
    full_name_placeholder: 'जैसे: जॉन डो',
    email_label: 'ईमेल पता *',
    email_placeholder: 'जैसे: john@example.com',
    message_label: 'संदेश *',
    message_placeholder: 'हम आपके व्यवसाय की कैसे मदद कर सकते हैं?',
    send_message_btn: 'संदेश भेजें',
    processing_btn: 'प्रसंस्करण...',
    verifying_btn: 'सत्यापन किया जा रहा है...',
    confirm_code_btn: 'कोड की पुष्टि करें',
    resend_code_btn: 'ईमेल द्वारा कोड पुनः भेजें',
    back_form_btn: '← फ़ॉर्म पर वापस जाएं',
    otp_sent_msg: 'हमने ईमेल पर 6 अंकों का सत्यापन कोड भेजा है',
    otp_enter_label: 'ओटीपी कोड दर्ज करें',
    test_mode_active: 'परीक्षण मोड सक्रिय',
    code_generated: 'उत्पन्न कोड',
    verification_completed: 'सत्यापन पूरा हुआ',
    message_sent_success: 'संदेश भेज दिया गया! हम संपर्क में रहेंगे।',
    send_another_msg: 'दूसरा संदेश भेजें',

    // Localizacao Page
    how_to_get: 'यहाँ कैसे आएं',
    location_title: 'लोकेशन',
    morada_label: 'पता',
    market_name: 'जिम्पेटो बाजार',
    bancada_label: 'स्टॉल 42-बी',
    horario_label: 'समय',
    weekday_hours: 'सोमवार - शुक्रवार',
    saturday_hours: 'शनिवार',
    sunday_hours: 'रविवार',
    sunday_closed: 'बंद',
    transports_label: 'निकटतम परिवहन',
    transport_chapa27: 'Chapa 27 – Museu/Zimpeto',
    transport_chapa34: 'Chapa 34 – Baixa/Zimpeto',
    transport_parking: 'साइट पर पार्किंग उपलब्ध है',
    google_maps_btn: 'गूगल मैप्स में खोलें →',
    need_help_title: 'मदद की ज़रूरत है?',
    help_call_msg: 'स्टॉक की उपलब्धता की पुष्टि करने के लिए आने से पहले कॉल या संदेश करें।',

    // Checkout Page
    cesto_empty_title: 'आपकी कार्ट खाली है',
    back_store_btn: 'दुकान पर जाएं',
    details_step: 'विवरण',
    payment_step: 'भुगतान',
    shipping_info_title: 'शिपिंग जानकारी',
    delivery_tab: 'वितरण',
    pickup_tab: 'पिक अप',
    telemovel: 'फ़ोन नंबर *',
    bairro_placeholder: 'मोहल्ला/क्षेत्र *',
    rua_placeholder: 'गली/सड़क *',
    casa_placeholder: 'मकान नंबर',
    referencia_placeholder: 'पता संदर्भ/लैंडमार्क',
    pickup_location_title: 'पिक अप स्थान:',
    pickup_schedule_msg: 'संचालन के घंटे: सोमवार - शनिवार: सुबह 7 - शाम 6 बजे',
    continue_payment_btn: 'भुगतान के लिए जारी रखें →',
    payment_method_title: 'भुगतान का प्रकार',
    mpesa_instructions_1: '1. राशि भेजें: 84 000 0000 (Zimpeto Wholesale)',
    mpesa_instructions_2: '2. भेजने के बाद, भुगतान की पुष्टि भेजें: 84 000 0000 (Zimpeto Wholesale) और हमारी पुष्टि की प्रतीक्षा करें।',
    confirmation_code_placeholder: 'पुष्टि कोड',
    agree_policies_label: 'मैं बिक्री नीतियों से सहमत हूँ',
    confirm_order_btn: 'ऑर्डर की पुष्टि करें →',
    processing_order_btn: 'ऑर्डर संसाधित किया जा रहा है...',
    order_summary_title: 'ऑर्डर सारांश',
    total_label: 'कुल',
    terminar_sessao: 'लॉग आउट',
    ola: 'नमस्ते, ',
    login_otp_title: 'ओटीपी के साथ लॉगिन करें',
    login_otp_desc: 'सत्यापन के लिए ओटीपी कोड प्राप्त करने के लिए अपना ईमेल दर्ज करें।',
    send_otp: 'कोड भेजें',
    verify_login: 'सत्यापित करें और लॉगिन करें',
    invalid_otp: 'गलत, समाप्त या पहले से उपयोग किया गया कोड।',
    email_required: 'कृपया अपना ईमेल दर्ज करें।',

    // Products
    'Arroz Don Pato (25kg)': 'डॉन पाटो चावल (25kg)',
    'Óleo Vegetal Somol (20L)': 'सोमोल वनस्पति तेल (20L)',
    'Leite UHT (12x1L)': 'यूएचटी दूध (12x1L)',
    'Farinha de Trigo (50kg)': 'गेहूं का आटा (50kg)',
    'Farinha Milho (10kg)': 'मक्के का आटा (10kg)',
    'Caixa Tomate (15kg)': 'टमाटर का डिब्बा (15kg)',
    'Açúcar Castanho (10kg)': 'ब्राउन शुगर (10kg)',
    'Feijão Manteiga (5kg)': 'मक्खन बीन्स (5kg)',
    'Batata Nacional (10kg)': 'राष्ट्रीय आलू (10kg)',
    'Cebola Branca (10kg)': 'सफेद प्याज (10kg)',
    'Detergente OMO (5kg)': 'ओएमओ डिटर्जेंट (5kg)',
    'Água (24x0.5L)': 'पानी (24x0.5L)',
    'Sal Refinado (20kg)': 'परिष्कृत नमक (20kg)',
    'Frango (fardo 10kg)': 'चिकन (10kg बेल)',

    // Recipes
    'Matapa Tradicional': 'पारंपरिक मातापा',
    'O prato mais icónico de Moçambique, feito com folhas de mandioca, amendoim e leite de coco.': 'मोज़ाम्बिक का सबसे प्रतिष्ठित व्यंजन, जो कसावा के पत्तों, मूंगफली और नारियल के दूध से बनाया जाता है।',
    '500g folhas de mandioca piladas': '500 ग्राम पिसी हुई कसावा की पत्तियां',
    '200g amendoim torrado moído': '200 ग्राम भुनी हुई पिसी हुई मूंगफली',
    '400ml leite de coco': '400 मिली नारियल का दूध',
    '300g camarão ou caranguejo': '300 ग्राम झींगा या केकड़ा',
    '4 dentes de alho': 'लहसुन की 4 कलियां',
    'Sal e piri-piri q.b.': 'स्वादानुसार नमक और पीरी-पीरी',
    'Lave as folhas de mandioca e deixa-as enxugar.': 'कसावा के पत्तों को धो लें और उन्हें सूखने दें।',
    'Coloque em um pilão, o alho, o sal e as folhas de mandioca.': 'खल और मूसल में लहसुन, नमक और कसावा के पत्ते डालें।',
    'Pile muito bem de modo que as folhas fiquem amassadas completamente.': 'बहुत अच्छी तरह से पीस लें ताकि पत्तियां पूरी तरह से मैश हो जाएं।',
    'Coloque tudo numa panela e deixe ferver por cerca de 30 minutos.': 'सब कुछ एक बर्तन में रखें और लगभग 30 मिनट तक उबलने दें।',
    'Coe o coco para obter o leite e reserve. Reserve também o amendoim pilado.': 'नारियल को छानकर दूध निकाल लें और अलग रख दें। पिसी हुई मूंगफली को भी अलग रख दें।',
    'Deite o leite de coco, juntamente com o amendoim pilado na matapa e o sal e deixa ferver durante algum tempo.': 'नारियल का दूध, पिसी हुई मूंगफली और नमक के साथ मातापा में डालें और कुछ देर के लिए उबलने दें।',
    'Junta o marisco.': 'समुद्री भोजन जोड़ें।',
    'Cozinha em lume brando por mais 30 minutos, mexendo sempre.': 'लगातार हिलाते हुए और 30 मिनट तक धीमी आंच पर पकाएं।',
    'Tempera com sal e piri-piri. Serve com arroz branco.': 'नमक और पीरी-पीरी से सीज़न करें। सफेद चावल के साथ परोसें।',

    'Caril de Peixe': 'मछली करी',
    'Caril aromático com peixe fresco, tomate e especiarias típicas moçambicanas.': 'ताजा मछली, टमाटर और विशिष्ट मोज़ाम्बिकन मसालों के साथ सुगंधित करी।',
    '650 g de tomate maduro': '650 ग्राम पके टमाटर',
    '500 ml de azeite': '500 मिली जैतून का तेल',
    '150 ml de leite de coco': '150 मिली नारियल का दूध',
    '100 ml de água ou caldo de legumes': '100 मिली पानी या सब्जी का शोरबा',
    '4 postas de pescada': '4 हेक फ़िलेट',
    '2 cardamomos verdes': '2 हरी इलायची',
    '2 dentes de alho': 'लहसुन की 2 कलियां',
    '2 limas': '2 नीबू',
    '1 colher de chá de gengibre em pó': '1 छोटा चम्मच अदरक पाउडर',
    '1 colher de chá de caril': '1 छोटा चम्मच करी पाउडर',
    '1 colher de chá de coentros em pó': '1 छोटा चम्मच धनिया पाउडर',
    '1 colher de chá de sementes de mostarda': '1 छोटा चम्मच सरसों के बीज',
    '1 ramo de coentros picados': '1 गुच्छा कटा हुआ धनिया',
    '1/2 colher de chá de açafrão das índias': '1/2 छोटा चम्मच हल्दी',
    '1/2 malagueta': '1/2 मिर्च',
    'Sal a gosto': 'स्वादानुसार नमक',
    'Tempere as postas de pescada com sal e sumo de uma lima. Reserve.': 'हेक फ़िलेट्स को नमक और एक नीबू के रस से सीज़न करें। अलग रख दें।',
    'Leve uma panela ao lume com o azeite, o gengibre, o açafrão, o coentro em pó, o caril, os cardamomos e as sementes de mostarda. Deixe cozinhar, mas continue mexendo.': 'जैतून का तेल, अदरक, हल्दी, धनिया पाउडर, करी, इलायची और सरसों के बीज के साथ एक बर्तन को आंच पर रखें। लगातार चलाते हुए पकाएं।',
    'Junte os dentes de alho picados, a malagueta picada sem sementes, o tomate picado (sem pele e sem sementes) e a água ou o caldo de legumes. Deixe ferver, e mexe de vez em quando, até o tomate esteja bem cozido.': 'कटी हुई लहसुन की कलियां, बीज निकाली हुई कटी हुई मिर्च, कटा हुआ टमाटर (छिला और बीज निकाला हुआ), और पानी या सब्जी का शोरबा डालें। उबाल लें और बीच-बीच में हिलाते रहें जब तक कि टमाटर अच्छी तरह पक न जाएं।',
    'Adicione as postas de pescada e o leite de coco.': 'हेक फ़िलेट्स और नारियल का दूध डालें।',
    'Rectifique o sal.': 'नमक स्वादानुसार समायोजित करें।',
    'Deixe cozinhar até o peixe esteja cozido.': 'मछली के पकने तक पकने दें।',
    'Regue o caril com um pouco de sumo de lima.': 'करी के ऊपर थोड़ा नीबू का रस निचोड़ें।',
    'Polvilhe com coentros frescos picados.': 'ताजा कटे धनिये से छिड़कें।',
    'Sirva as postas de pescada com arroz branco.': 'हेक फ़िलेट्स को सफेद चावल के साथ परोसें।',
    'Bom apetite.': 'भोजन का आनंद लें।',

    'Frango Grelhado Piri-Piri': 'ग्रिल्ड पीरी-पीरी चिकन',
    'Frango marinado em molho piri-piri caseiro, grelhado na brasa.': 'घर के बने पीरी-पीरी सॉस में मैरीनेट किया हुआ चिकन, कोयले पर ग्रिल किया हुआ।',
    '1 frango inteiro (cerca de 1,5 kg) cortado em partes (ou 4 coxas de frango, se preferir)': '1 साबुत चिकन (लगभग 1.5 किलोग्राम) टुकड़ों में कटा हुआ (या इच्छानुसार 4 चिकन जांघ)',
    '4 dentes de alho picados': '4 कटी हुई लहसुन की कलियां',
    '2 malaguetas vermelhas (ou a gosto)': '2 लाल मिर्च (या स्वादानुसार)',
    '1 colher de chá de pimenta caiena (opcional, para aumentar o picante)': '1 छोटा चम्मच लाल मिर्च पाउडर (वैकल्पिक, अतिरिक्त तीखेपन के लिए)',
    '1 colher de chá de paprica doce': '1 छोटा चम्मच मीठी पपरिका',
    '1 colher de sopa de vinagre de vinho branco': '1 बड़ा चम्मच सफेद वाइन सिरका',
    '1 colher de sopa de azeite': '1 बड़ा चम्मच जैतून का तेल',
    '1 colher de sopa de sumo de limão': '1 बड़ा चम्मच नीबू का रस',
    '1 colher de chá de sal': '1 छोटा चम्मच नमक',
    '1 colher de chá de açúcar (opcional, para equilibrar o picante)': '1 छोटा चम्मच चीनी (वैकल्पिक, तीखेपन को संतुलित करने के लिए)',
    '1 ramo de salsa (opcional, para decorar)': 'पार्सले का 1 डंठल (वैकल्पिक, सजाने के लिए)',
    'Num almofariz ou num processador de alimentos, triture os dentes de alho com as malaguetas, a pimenta caiena (se estiver a usar), a paprica, o vinagre, o azeite, o sumo de limão, o sal e o açúcar (se optar por usá-lo).': 'खल और मूसल या फूड प्रोसेसर में लहसुन की कलियों को मिर्च, लाल मिर्च पाउडर (यदि उपयोग कर रहे हैं), पपरिका, सिरका, जैतून का तेल, नीबू का रस, नमक और चीनी (यदि उपयोग कर रहे हैं) के साथ पीस लें।',
    'Se gostar de uma marinada mais líquida, adicione um pouco mais de azeite ou vinagre até obter a consistência desejada.': 'यदि आपको अधिक तरल मैरीनेड पसंद है, तो इच्छित स्थिरता प्राप्त होने तक थोड़ा और जैतून का तेल या सिरका मिलाएं।',
    'Prove e ajuste os temperos, adicionando mais piri-piri ou sal conforme o seu gosto.': 'चखें और सीज़निंग को समायोजित करें, अपनी पसंद के अनुसार अधिक पीरी-पीरी या नमक मिलाएं।',
    'Coloque o frango cortado em partes (ou as coxas, se for esse o caso) numa tigela grande.': 'चिकन के टुकड़ों (या जांघों) को एक बड़े कटोरे में रखें।',
    'Regue o frango com a marinada de piri-piri, envolvendo bem para que todas as partes fiquem bem tempoadas.': 'चिकन के ऊपर पीरी-पीरी मैरीनेड डालें, सभी टुकड़ों को अच्छी तरह से कोट करने के लिए मिलाएं।',
    'Cubra com película aderente e deixe marinar no frigorífico durante pelo menos 2 horas (idealmente, de um dia para o outro para intensificar os sabores).': 'क्लिंग रैप से ढकें और कम से कम 2 घंटे के लिए फ्रिज में मैरीनेट होने दें (आदर्श रूप से, स्वाद बढ़ाने के लिए रात भर)।',
    'Aqueça a grelha ou a churrasqueira em temperatura média-alta.': 'ग्रिल या बारबेक्यू को मध्यम-उच्च तापमान पर गर्म करें।',
    'Coloque o frango na grelha e cozinhe por cerca de 25 a 30 minutos, virando-o ocasionalmente para garantir que fica bem dourado e cozinhado por igual.': 'चिकन को ग्रिल पर रखें और लगभग 25 से 30 मिनट तक पकाएं, बीच-बीच में पलटते रहें ताकि यह समान रूप से भूरा और पक जाए।',
    'O frango deve estar completamente cozido por dentro, mas com a pele crocante e caramelizada.': 'चिकन अंदर से पूरी तरह से पका होना चाहिए, लेकिन त्वचा कुरकुरी और कैरामेलाइज़्ड होनी चाहिए।',
    'Se estiver a usar uma grelha em casa, pode também grelhar na frigideira ou no forno, dependendo do equipamento disponível.': 'यदि आप घर पर ग्रिल का उपयोग कर रहे हैं, तो उपलब्ध उपकरणों के आधार पर आप पैन-फ्राई या बेक भी कर सकते हैं।',
    'Depois de grelhado, retire o frango da grelha e deixe repousar uns minutos.': 'ग्रिल होने के बाद, चिकन को आंच से हटा दें और कुछ मिनट के लिए आराम करने दें।',
    'Sirva o frango com uma salada fresca, batatas fritas ou arroz.': 'चिकन को ताज़ा सलाद, फ्रेंच फ्राइज़ या चावल के साथ परोसें।',
    'Decore com um pouco de salsa picada, se desejar, para dar um toque de frescor.': 'यदि चाहें, तो ताज़गी के स्पर्श के लिए थोड़े कटे हुए पार्सले से सजाएं।',

    'Arroz de Coco': 'नारियल चावल',
    'Arroz cremoso cozinhado em leite de coco, acompanhamento perfeito.': 'नारियल के दूध में पकाया गया मलाईदार चावल, एक आदर्श साइड डिश।',
    '2 chávenas de arroz': '2 कप चावल',
    '2 chávenas de água': '2 कप पानी',
    '1 colher de sal': '1 चम्मच नमक',
    '1 pau de canela': '1 दालचीनी स्टिक',
    'Lava o arroz até a água sair limpa.': 'चावल को तब तक धोएं जब तक पानी साफ न हो जाए।',
    'Mistura o leite de coco com a água e o sal.': 'नारियल के दूध को पानी और नमक के साथ मिलाएं।',
    'Coloca o arroz e o pau de canela na panela.': 'बर्तन में चावल और दालचीनी स्टिक डालें।',
    'Cozinha em lume médio-baixo com tampa durante 20 min.': 'ढककर मध्यम-धीमी आंच पर 20 मिनट तक पकाएं।',
    'Remove o pau de canela e serve.': 'दालचीनी स्टिक हटाएँ और परोसें।'
  }
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (v: boolean) => void;
  lastAdded: string | null;
  popupProduct: Product | null;
  setPopupProduct: (p: Product | null) => void;
  clearCart: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [popupProduct, setPopupProduct] = useState<Product | null>(null);
  const [language, setLanguageState] = useState<Language>('pt');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('zimpeto_lang') as Language;
    if (saved && TRANSLATIONS[saved]) {
      setLanguageState(saved);
    }
    const savedUser = localStorage.getItem('zimpeto_user_email');
    if (savedUser) {
      setUserEmail(savedUser);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('zimpeto_lang', lang);
  };

  const login = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('zimpeto_user_email', email);
  };

  const logout = () => {
    setUserEmail(null);
    localStorage.removeItem('zimpeto_user_email');
  };

  const isAdmin = !!userEmail && userEmail.toLowerCase().includes('admin');

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['pt']?.[key] || key;
  };

  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qtd: item.qtd + qty } : item
        );
      }
      return [...prev, { ...product, qtd: qty }];
    });
    setLastAdded(product.name);
    setTimeout(() => setLastAdded(null), 3000);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qtd: Math.max(1, item.qtd + delta) } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.qtd, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qtd, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity,
      cartCount, cartTotal, isCartOpen, setIsCartOpen,
      lastAdded, popupProduct, setPopupProduct, clearCart,
      language, setLanguage, t,
      userEmail, login, logout, isAdmin
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
