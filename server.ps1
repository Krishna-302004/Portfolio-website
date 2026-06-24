# Lightweight PowerShell HTTP Local Server for Krishna Rajeev's Portfolio
$port = 3006
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Output "HTTP Local Server successfully started."
    Write-Output "URL: http://localhost:$port/"
    Write-Output "Press CTRL+C or stop the task to terminate."
    
    $root = "C:\Users\student\.gemini\antigravity\scratch\krishna-portfolio"
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        # Route directory root to index.html
        if ($urlPath -eq "/") { 
            $urlPath = "/index.html" 
        }
        
        # Clean URL path to avoid path traversal
        $urlPath = $urlPath.Replace("..", "")
        $filePath = Join-Path $root $urlPath
        
        if (Test-Path $filePath -PathType Leaf) {
            Write-Output "Serving file: $filePath"
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            Write-Output "Bytes length: $($bytes.Length)"
            
            # Identify MIME types
            if ($filePath.EndsWith(".html")) { 
                $response.ContentType = "text/html; charset=utf-8" 
            }
            elseif ($filePath.EndsWith(".css")) { 
                $response.ContentType = "text/css; charset=utf-8" 
            }
            elseif ($filePath.EndsWith(".js")) { 
                $response.ContentType = "application/javascript; charset=utf-8" 
            }
            elseif ($filePath.EndsWith(".png")) { 
                $response.ContentType = "image/png" 
            }
            
            if ($request.HttpMethod -eq "HEAD") {
                $response.ContentLength64 = $bytes.Length
                $response.Close()
            } else {
                $response.Close($bytes, $false)
            }
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found")
            if ($request.HttpMethod -eq "HEAD") {
                $response.ContentLength64 = $errBytes.Length
                $response.Close()
            } else {
                $response.Close($errBytes, $false)
            }
        }
    }
} catch {
    Write-Error $_.Exception.Message
} finally {
    $listener.Stop()
}
