document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('app-container');

    try {
        // In Vite, assets in public/ are served from root
        const response = await fetch(import.meta.env.BASE_URL + 'data/app_data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        renderApp(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        container.innerHTML = `
          <div class="p-8 text-center">
              <p class="text-red-500 font-medium">加载数据失败</p>
              <p class="text-sm text-gray-500 mt-2">请确保您是通过本地服务器(如Live Server)运行此页面的。</p>
              <p class="text-xs text-gray-400 mt-1">${error.message}</p>
          </div>
      `;
        container.classList.remove('opacity-0');
    }

    function renderApp(data) {
        // images in public/ are referenced from root context
        const coverPath = import.meta.env.BASE_URL + (data.cover.startsWith('/') ? data.cover.slice(1) : data.cover);

        container.innerHTML = `
            <div class="relative">
              <div class="h-72 bg-gray-900 relative overflow-hidden group">
                  <div class="absolute inset-0 transform -skew-y-3 scale-110 origin-bottom-left">
                    <div class="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105" style="background-image: url('${import.meta.env.BASE_URL}images/MockupStudio.png');"></div>
                    <div class="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-amber-900/60 to-red-900/40 mix-blend-overlay"></div>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
              </div>
              <div class="absolute -bottom-12 left-8 md:left-12 flex items-end">
                  <img src="${coverPath}" alt="${data.title}" 
                       class="w-32 h-32 rounded-2xl shadow-xl border-4 border-white object-cover bg-white transform hover:scale-105 transition-transform duration-300">
              </div>
          </div >

            <div class="pt-16 px-6 md:px-12 pb-12">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">${data.title}</h1>
                        <p class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 font-bold text-sm mt-1 mb-2">${data.subtitle}</p>
                    </div>
                    <a href="${data.download.link}" target="_blank" 
                       class="w-full md:w-auto px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group border border-gray-800">
                        <span>立即下载</span>
                        <svg class="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </a>
                </div>

                <p class="text-gray-600 leading-relaxed mb-8 border-b border-gray-100 pb-8">
                    ${data.description}
                </p>

                <div class="mb-4">
                    <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div class="p-1.5 bg-orange-100/50 rounded-lg text-orange-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                        </div>
                        核心特性
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${data.features ? data.features.map(feature => `
                          <div class="p-4 rounded-xl bg-orange-50/30 border border-orange-100/50 hover:bg-orange-50 hover:border-orange-200 hover:shadow-sm transition-all duration-200 group">
                              <h3 class="font-semibold text-gray-800 mb-1 text-sm group-hover:text-orange-700 transition-colors">${feature.title}</h3>
                              <p class="text-xs text-gray-500 leading-relaxed">${feature.content}</p>
                          </div>
                      `).join('') : ''}
                    </div>
                </div>
            </div>
        `;

        // Simple fade in animation
        requestAnimationFrame(() => {
            container.classList.remove('opacity-0');
            container.classList.add('opacity-100');
        });
    }
});
