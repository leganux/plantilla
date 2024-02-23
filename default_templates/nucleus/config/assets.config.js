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
                baseUrl + 'dist/js/pages/dashboard2.js',

            ],
            styles: [
                'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
                baseUrl + 'plugins/fontawesome-free/css/all.min.css',
                baseUrl + 'plugins/overlayScrollbars/css/OverlayScrollbars.min.css',

                baseUrl + 'plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',
                baseUrl + 'plugins/datatables-responsive/css/responsive.bootstrap4.min.css',
                baseUrl + 'plugins/datatables-buttons/css/buttons.bootstrap4.min.css',

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

