package com.ahmedbouamoud.daftar

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import android.print.PrintManager
import android.view.Menu
import android.view.MenuItem
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var pendingPrintMode: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        setupWebView()
        webView.loadUrl("file:///android_asset/index.html")
    }

    private fun setupWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.setSupportZoom(true)
        settings.builtInZoomControls = true
        settings.displayZoomControls = false
        settings.textZoom = 100
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        webView.addJavascriptInterface(AndroidBridge(), "AndroidBridge")

        webView.webChromeClient = object : WebChromeClient() {
            override fun onJsAlert(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setMessage(message)
                    .setPositiveButton("موافق") { _, _ -> result?.confirm() }
                    .setOnCancelListener { result?.cancel() }
                    .create().show()
                return true
            }

            override fun onJsConfirm(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setMessage(message)
                    .setPositiveButton("نعم") { _, _ -> result?.confirm() }
                    .setNegativeButton("لا") { _, _ -> result?.cancel() }
                    .setOnCancelListener { result?.cancel() }
                    .create().show()
                return true
            }

            override fun onJsPrompt(view: WebView?, url: String?, message: String?, defaultValue: String?, result: JsPromptResult?): Boolean {
                val input = android.widget.EditText(this@MainActivity)
                input.setText(defaultValue ?: "")
                input.setTextIsSelectable(true)
                AlertDialog.Builder(this@MainActivity)
                    .setMessage(message)
                    .setView(input)
                    .setPositiveButton("موافق") { _, _ -> result?.confirm(input.text.toString()) }
                    .setNegativeButton("إلغاء") { _, _ -> result?.cancel() }
                    .setOnCancelListener { result?.cancel() }
                    .create().show()
                return true
            }
        }

        // Inject JS overrides after page load to intercept window.print()
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                injectJsBridge()
            }
        }
    }

    private fun injectJsBridge() {
        // Override window.print() to call native Android print
        val js = """
            (function() {
                window._originalPrint = window.print;
                window.print = function() {
                    var mode = document.body.classList.contains('print-one-lesson') ? 'one' : 'full';
                    AndroidBridge.triggerPrint(mode);
                };

                if (navigator && navigator.clipboard) {
                    navigator.clipboard.writeText = function(text) {
                        AndroidBridge.copyToClipboard(text);
                        return Promise.resolve();
                    };
                }
            })();
        """.trimIndent()
        webView.evaluateJavascript(js, null)
    }

    inner class AndroidBridge {
        @JavascriptInterface
        fun triggerPrint(mode: String) {
            pendingPrintMode = mode
            runOnUiThread { startNativePrint() }
        }

        @JavascriptInterface
        fun copyToClipboard(text: String) {
            runOnUiThread {
                val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                val clip = ClipData.newPlainText("نسخة احتياطية - دفتر النصوص", text)
                clipboard.setPrimaryClip(clip)
                Toast.makeText(this@MainActivity, "تم نسخ النسخة الاحتياطية", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun startNativePrint() {
        val printManager = getSystemService(Context.PRINT_SERVICE) as PrintManager
        val jobName = if (pendingPrintMode == "one") "دفتر النصوص — درس واحد" else "دفتر النصوص — كامل"
        val printAdapter = webView.createPrintDocumentAdapter(jobName)
        printManager.print(jobName, printAdapter, null)
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_print_full -> {
                webView.evaluateJavascript("printFullJournal()", null)
                true
            }
            R.id.action_print_lesson -> {
                webView.evaluateJavascript("printSelectedLesson()", null)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
