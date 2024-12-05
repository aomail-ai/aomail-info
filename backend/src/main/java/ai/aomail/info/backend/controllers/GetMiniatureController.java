package ai.aomail.info.backend.controllers;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class GetMiniatureController {
    @GetMapping(value = "/miniature-data/{miniatureName}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getMiniatureData(@PathVariable String miniatureName) throws IOException {
        Path miniaturePath = Paths.get("backend/src/main/resources/static/miniatureImages/" + miniatureName);
        return Files.readAllBytes(miniaturePath);
    }
}
