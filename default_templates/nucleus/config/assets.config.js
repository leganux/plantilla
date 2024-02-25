let baseUrl = '/cdn/dashboard/'
let baseUrl_site = '/cdn'

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
                baseUrl + 'plugins/datatables/jquery.dataTables.min.js',
                baseUrl + 'plugins/datatables-bs4/js/dataTables.bootstrap4.min.js',
                baseUrl + 'plugins/datatables-responsive/js/dataTables.responsive.min.js',
                baseUrl + 'plugins/datatables-responsive/js/responsive.bootstrap4.min.js',
                baseUrl + 'plugins/datatables-buttons/js/dataTables.buttons.min.js',
                baseUrl + 'plugins/datatables-buttons/js/buttons.bootstrap4.min.js',
                baseUrl + 'plugins/jszip/jszip.min.js',
                baseUrl + 'plugins/pdfmake/pdfmake.min.js',
                baseUrl + 'plugins/pdfmake/vfs_fonts.js',
                baseUrl + 'plugins/datatables-buttons/js/buttons.html5.min.js',
                baseUrl + 'plugins/datatables-buttons/js/buttons.print.min.js',
                baseUrl + 'plugins/datatables-buttons/js/buttons.colVis.min.js',
                baseUrl + 'plugins/moment/moment-with-locales.js',
                baseUrl + 'plugins/sweetalert2/sweetalert2.all.js',


            ],
            styles: [
                'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
                baseUrl + 'plugins/fontawesome-free/css/all.min.css',
                baseUrl + 'plugins/overlayScrollbars/css/OverlayScrollbars.min.css',

                baseUrl + 'plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',
                baseUrl + 'plugins/datatables-responsive/css/responsive.bootstrap4.min.css',
                baseUrl + 'plugins/datatables-buttons/css/buttons.bootstrap4.min.css',

                baseUrl + 'plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css',

                baseUrl + 'dist/css/adminlte.min.css',

            ],
            logo: '/cdn/images/nucleus_simple.png'
        },
        site: {
            logo: '/cdn/images/nucleusfull.png',
            scripts: [
                baseUrl_site + '/site/js/jquery-1.10.2.min.js',
                baseUrl_site + '/site/js/jquery.backstretch.min.js',
                baseUrl_site + '/site/js/jquery.countdown.min.js',
                baseUrl_site + '/site/js/wow.min.js',
                baseUrl_site + '/site/js/scripts.js',
            ],
            styles: [
                'http://fonts.googleapis.com/css?family=Roboto:400,300,100,100italic,300italic,400italic,700,700italic',
                baseUrl_site + '/site/bootstrap/css/bootstrap.min.css',
                baseUrl_site + '/site/css/animate.css',
                baseUrl_site + '/site/css/form-elements.css',
                baseUrl_site + '/site/css/style.css',
                baseUrl_site + '/site/css/media-queries.css',

            ],
        }
    }
    this.getAssetsAdmin = function () {
        return this.assets.dashboard
    }
    this.getAssetsSite = function () {
        return this.assets.site
    }
}

