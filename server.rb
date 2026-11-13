require 'webrick'

dir = File.expand_path(__dir__)
port = 8000

server = WEBrick::HTTPServer.new(
  Port: port,
  Logger: WEBrick::Log.new($stdout, WEBrick::Log::INFO),
  AccessLog: [[$stdout, WEBrick::AccessLog::COMBINED_LOG_FORMAT]]
)

# Helper to get latest mtime of html/css/js files
def latest_mtime(dir)
  Dir.glob(File.join(dir, '*.{html,css,js}')).map { |f| File.mtime(f).to_i }.max || 0
end

# Live reload polling endpoint
server.mount_proc('/__live_reload') do |req, res|
  res['Content-Type'] = 'application/json'
  res['Cache-Control'] = 'no-cache'
  res.body = "{\"version\": #{latest_mtime(dir)}}"
end

# Main static file server
server.mount_proc('/') do |req, res|
  clean_path = req.path.split('?').first
  clean_path = '/index.html' if clean_path == '/'
  file_path = File.join(dir, clean_path)

  if File.file?(file_path)
    content = File.read(file_path)
    ext = File.extname(file_path).downcase

    res['Cache-Control'] = 'no-cache, no-store, must-revalidate'

    case ext
    when '.html'
      res['Content-Type'] = 'text/html; charset=utf-8'
      # Inject lightweight auto-reload script right before </body>
      live_reload_script = <<~JS
        <script>
          (function() {
            let lastVer = null;
            setInterval(async () => {
              try {
                const res = await fetch('/__live_reload');
                const data = await res.json();
                if (lastVer !== null && data.version > lastVer) {
                  console.log('[LiveReload] Cambios detectados, recargando página...');
                  location.reload();
                }
                lastVer = data.version;
              } catch(e) {}
            }, 1000);
          })();
        </script>
      JS
      if content.include?('</body>')
        content = content.sub('</body>', "#{live_reload_script}\n</body>")
      else
        content += live_reload_script
      end
      res.body = content
    when '.css'
      res['Content-Type'] = 'text/css; charset=utf-8'
      res.body = content
    when '.js'
      res['Content-Type'] = 'application/javascript; charset=utf-8'
      res.body = content
    when '.svg'
      res['Content-Type'] = 'image/svg+xml'
      res.body = content
    when '.png'
      res['Content-Type'] = 'image/png'
      res.body = content
    when '.jpg', '.jpeg'
      res['Content-Type'] = 'image/jpeg'
      res.body = content
    else
      res['Content-Type'] = 'application/octet-stream'
      res.body = content
    end
  else
    res.status = 404
    res['Content-Type'] = 'text/plain; charset=utf-8'
    res.body = "Archivo no encontrado: #{clean_path}"
  end
end

trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }

puts "Servidor de desarrollo activo en http://localhost:#{port}"
server.start
