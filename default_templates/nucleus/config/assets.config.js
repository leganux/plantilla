let baseUrl = '/cdn/dashboard/'

module.exports = function () {
    this.assets = {
        dashboard: {
            scripts: [

                baseUrl + 'plugins/jquery/jquery.min.js',
                baseUrl + 'plugins/bootstrap/js/bootstrap.bundle.min.js',
                baseUrl + 'plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js',
                baseUrl + 'dist/js/adminlte.js',
                baseUrl + 'plugins/jquery-mousewheel/jquery.mousewheel.js',
                baseUrl + 'plugins/raphael/raphael.min.js',
                baseUrl + 'plugins/jquery-mapael/jquery.mapael.min.js',
                baseUrl + 'plugins/jquery-mapael/maps/usa_states.min.js',
                baseUrl + 'plugins/chart.js/Chart.min.js',
                baseUrl + 'dist/js/pages/dashboard2.js',

            ],
            styles: [
                'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
                baseUrl + 'plugins/fontawesome-free/css/all.min.css',
                baseUrl + 'plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
                baseUrl + 'dist/css/adminlte.min.css',

            ],
            logo: ''
        },
        site: {
            scripts: [],
            styles: [],
        }
    }
    this.getAssetsAdmin = function () {
        return this.assets.dashboard
    }
    this.getAssetsSite = function () {
        return this.assets.site
    }
}

